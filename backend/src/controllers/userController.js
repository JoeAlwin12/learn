const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, full_name, role = 'sales' } = req.body;

    // Validation
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    if (!['admin', 'manager', 'sales'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await pool.query(
      'INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, username, email, hashedPassword, full_name, role]
    );

    res.status(201).json({
      id,
      username,
      email,
      full_name,
      role,
      is_active: true
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, full_name } = req.body;

    if (!email && !full_name) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Get current user
    const currentUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedEmail = email || currentUser.rows[0].email;
    const updatedFullName = full_name || currentUser.rows[0].full_name;

    // Check for duplicate email
    if (email && email !== currentUser.rows[0].email) {
      const emailExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    await pool.query(
      'UPDATE users SET email = $1, full_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [updatedEmail, updatedFullName, id]
    );

    res.json({
      id,
      username: currentUser.rows[0].username,
      email: updatedEmail,
      full_name: updatedFullName
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Check if user exists
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot deactivate your own account' });
    }

    await pool.query('UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
