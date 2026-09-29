const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function getAllProcessTypes(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, description, is_active, created_at FROM process_types ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get process types error:', error);
    res.status(500).json({ error: 'Failed to fetch process types' });
  }
}

async function getProcessTypeById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, description, is_active, created_at FROM process_types WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Process type not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get process type error:', error);
    res.status(500).json({ error: 'Failed to fetch process type' });
  }
}

async function createProcessType(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if process type already exists
    const existing = await pool.query(
      'SELECT id FROM process_types WHERE name = $1',
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Process type with this name already exists' });
    }

    const id = uuidv4();

    await pool.query(
      'INSERT INTO process_types (id, name, description) VALUES ($1, $2, $3)',
      [id, name, description || null]
    );

    res.status(201).json({
      id,
      name,
      description: description || null
    });
  } catch (error) {
    console.error('Create process type error:', error);
    res.status(500).json({ error: 'Failed to create process type' });
  }
}

async function updateProcessType(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && description === undefined) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Get current process type
    const current = await pool.query('SELECT * FROM process_types WHERE id = $1', [id]);

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Process type not found' });
    }

    const updatedName = name || current.rows[0].name;
    const updatedDescription = description !== undefined ? description : current.rows[0].description;

    // Check for duplicate name
    if (name && name !== current.rows[0].name) {
      const duplicate = await pool.query('SELECT id FROM process_types WHERE name = $1', [name]);
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ error: 'Process type with this name already exists' });
      }
    }

    await pool.query(
      'UPDATE process_types SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [updatedName, updatedDescription, id]
    );

    res.json({
      id,
      name: updatedName,
      description: updatedDescription
    });
  } catch (error) {
    console.error('Update process type error:', error);
    res.status(500).json({ error: 'Failed to update process type' });
  }
}

async function deleteProcessType(req, res) {
  try {
    const { id } = req.params;

    // Check if process type exists
    const result = await pool.query('SELECT id FROM process_types WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Process type not found' });
    }

    await pool.query('UPDATE process_types SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.json({ message: 'Process type archived successfully' });
  } catch (error) {
    console.error('Delete process type error:', error);
    res.status(500).json({ error: 'Failed to delete process type' });
  }
}

module.exports = {
  getAllProcessTypes,
  getProcessTypeById,
  createProcessType,
  updateProcessType,
  deleteProcessType
};
