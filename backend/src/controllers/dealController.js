const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const STAGES = ['interested', 'requirement_confirmed', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];

async function getAllDeals(req, res) {
  try {
    const { stage, process_type_id, country, product } = req.query;
    
    let query = `
      SELECT 
        d.id, d.company_name, d.product, d.location, d.deal_value, d.stage, 
        d.process_type_id, d.primary_owner_id, d.created_at, d.updated_at,
        u.username as owner_name,
        pt.name as process_type_name,
        json_agg(json_build_object('id', dtm.user_id, 'username', u2.username)) FILTER (WHERE dtm.user_id IS NOT NULL) as team_members
      FROM deals d
      LEFT JOIN users u ON d.primary_owner_id = u.id
      LEFT JOIN process_types pt ON d.process_type_id = pt.id
      LEFT JOIN deal_team_members dtm ON d.id = dtm.deal_id
      LEFT JOIN users u2 ON dtm.user_id = u2.id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (stage) {
      conditions.push(`d.stage = $${paramCount}`);
      params.push(stage);
      paramCount++;
    }

    if (process_type_id) {
      conditions.push(`d.process_type_id = $${paramCount}`);
      params.push(process_type_id);
      paramCount++;
    }

    if (country) {
      conditions.push(`d.location ILIKE $${paramCount}`);
      params.push(`%${country}%`);
      paramCount++;
    }

    if (product) {
      conditions.push(`d.product ILIKE ${paramCount}`);
      params.push(`%${product}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY d.id, u.username, pt.name ORDER BY d.created_at DESC';

    const result = await pool.query(query, params);
    
    // Format response with team members
    const deals = result.rows.map(row => ({
      ...row,
      team_members: row.team_members ? row.team_members.filter(tm => tm.id) : []
    }));

    res.json(deals);
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
}

async function getDealById(req, res) {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        d.id, d.company_name, d.location, d.deal_value, d.stage, 
        d.process_type_id, d.primary_owner_id, d.created_at, d.updated_at,
        u.username as owner_name, u.full_name as owner_full_name,
        pt.name as process_type_name,
        json_agg(json_build_object('id', dtm.user_id, 'username', u2.username, 'full_name', u2.full_name)) FILTER (WHERE dtm.user_id IS NOT NULL) as team_members
      FROM deals d
      LEFT JOIN users u ON d.primary_owner_id = u.id
      LEFT JOIN process_types pt ON d.process_type_id = pt.id
      LEFT JOIN deal_team_members dtm ON d.id = dtm.deal_id
      LEFT JOIN users u2 ON dtm.user_id = u2.id
      WHERE d.id = $1
      GROUP BY d.id, u.username, u.full_name, pt.name
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const deal = result.rows[0];
    deal.team_members = deal.team_members ? deal.team_members.filter(tm => tm.id) : [];

    res.json(deal);
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
}

async function createDeal(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { company_name, product, location, deal_value, process_type_id, team_member_ids } = req.body;
    const primary_owner_id = req.user.id;

    // Validation
    if (!company_name || !location || deal_value === undefined || !process_type_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if process type exists
    const ptResult = await pool.query('SELECT id FROM process_types WHERE id = $1', [process_type_id]);
    if (ptResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid process type' });
    }

    const dealId = uuidv4();

    // Insert deal
    await client.query(
      'INSERT INTO deals (id, company_name, product, location, deal_value, process_type_id, primary_owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [dealId, company_name, product || null, location, deal_value, process_type_id, primary_owner_id]
    );

    // Add primary owner to team
    await client.query(
      'INSERT INTO deal_team_members (deal_id, user_id) VALUES ($1, $2)',
      [dealId, primary_owner_id]
    );

    // Add additional team members
    if (team_member_ids && Array.isArray(team_member_ids)) {
      for (const userId of team_member_ids) {
        if (userId !== primary_owner_id) {
          try {
            await client.query(
              'INSERT INTO deal_team_members (deal_id, user_id) VALUES ($1, $2)',
              [dealId, userId]
            );
          } catch (err) {
            // Silently skip if user not found or already added
          }
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      id: dealId,
      company_name,
      product: product || null,
      location,
      deal_value,
      stage: 'interested',
      process_type_id,
      primary_owner_id
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create deal error:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  } finally {
    client.release();
  }
}

async function updateDeal(req, res) {
  try {
    const { id } = req.params;
    const { company_name, product, location, deal_value, team_member_ids } = req.body;
    const userId = req.user.id;

    // Get deal
    const dealResult = await pool.query('SELECT primary_owner_id FROM deals WHERE id = $1', [id]);
    if (dealResult.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const primaryOwnerId = dealResult.rows[0].primary_owner_id;

    // Check authorization (only primary owner or team members)
    const teamCheck = await pool.query(
      'SELECT user_id FROM deal_team_members WHERE deal_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (teamCheck.rows.length === 0 && primaryOwnerId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this deal' });
    }

    // Update deal fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (company_name !== undefined) {
      updates.push(`company_name = $${paramCount}`);
      values.push(company_name);
      paramCount++;
    }

    if (product !== undefined) {
      updates.push(`product = ${paramCount}`);
      values.push(product || null);
      paramCount++;
    }

    if (location !== undefined) {
      updates.push(`location = $${paramCount}`);
      values.push(location);
      paramCount++;
    }

    if (deal_value !== undefined) {
      updates.push(`deal_value = $${paramCount}`);
      values.push(deal_value);
      paramCount++;
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      await pool.query(
        `UPDATE deals SET ${updates.join(', ')} WHERE id = $${paramCount}`,
        values
      );
    }

    // Update team members if provided
    if (team_member_ids && Array.isArray(team_member_ids)) {
      // Delete existing team members (except primary owner)
      await pool.query('DELETE FROM deal_team_members WHERE deal_id = $1', [id]);

      // Add primary owner
      await pool.query(
        'INSERT INTO deal_team_members (deal_id, user_id) VALUES ($1, $2)',
        [id, primaryOwnerId]
      );

      // Add team members
      for (const userId of team_member_ids) {
        try {
          await pool.query(
            'INSERT INTO deal_team_members (deal_id, user_id) VALUES ($1, $2)',
            [id, userId]
          );
        } catch (err) {
          // Silently skip duplicates
        }
      }
    }

    res.json({ message: 'Deal updated successfully' });
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
}

async function deleteDeal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get deal
    const dealResult = await pool.query('SELECT primary_owner_id FROM deals WHERE id = $1', [id]);
    if (dealResult.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const primaryOwnerId = dealResult.rows[0].primary_owner_id;

    // Check authorization (only primary owner can delete)
    if (primaryOwnerId !== userId) {
      return res.status(403).json({ error: 'Only the deal owner can delete this deal' });
    }

    await pool.query('DELETE FROM deals WHERE id = $1', [id]);

    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
}

async function updateDealStage(req, res) {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const userId = req.user.id;

    if (!stage) {
      return res.status(400).json({ error: 'Stage is required' });
    }

    if (!STAGES.includes(stage)) {
      return res.status(400).json({ error: `Invalid stage. Must be one of: ${STAGES.join(', ')}` });
    }

    // Get deal
    const dealResult = await pool.query('SELECT primary_owner_id FROM deals WHERE id = $1', [id]);
    if (dealResult.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const primaryOwnerId = dealResult.rows[0].primary_owner_id;

    // Check authorization (only team members can move deals)
    const teamCheck = await pool.query(
      'SELECT user_id FROM deal_team_members WHERE deal_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (teamCheck.rows.length === 0 && primaryOwnerId !== userId) {
      return res.status(403).json({ error: 'Only team members can update deal stage' });
    }

    await pool.query(
      'UPDATE deals SET stage = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [stage, id]
    );

    res.json({ message: 'Deal stage updated successfully', stage });
  } catch (error) {
    console.error('Update deal stage error:', error);
    res.status(500).json({ error: 'Failed to update deal stage' });
  }
}

module.exports = {
  getAllDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealStage
};
