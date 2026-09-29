import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI, processTypeAPI } from '../services/api';
import styles from '../styles/AdminPanel.module.css';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [processTypes, setProcessTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', full_name: '' });
  const [newProcessType, setNewProcessType] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, ptRes] = await Promise.all([
        userAPI.getAll(),
        processTypeAPI.getAll(),
      ]);
      setUsers(usersRes.data);
      setProcessTypes(ptRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.full_name) {
      setError('All fields required');
      return;
    }
    try {
      await userAPI.create(newUser);
      setSuccess('User created successfully');
      setNewUser({ username: '', email: '', password: '', full_name: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userAPI.delete(id);
      setSuccess('User deleted');
      fetchData();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleCreateProcessType = async (e) => {
    e.preventDefault();
    if (!newProcessType.name) {
      setError('Process type name required');
      return;
    }
    try {
      await processTypeAPI.create(newProcessType);
      setSuccess('Process type created');
      setNewProcessType({ name: '', description: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create process type');
    }
  };

  const handleDeleteProcessType = async (id) => {
    if (!window.confirm('Delete this process type?')) return;
    try {
      await processTypeAPI.delete(id);
      setSuccess('Process type deleted');
      fetchData();
    } catch (err) {
      setError('Failed to delete process type');
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h2 className={styles.logo}>Quantic</h2>
          <span>Admin Panel</span>
        </div>
        <div className={styles.navRight}>
          <button onClick={() => navigate('/')}>Back to Dashboard</button>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👤 Users
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'processTypes' ? styles.active : ''}`}
            onClick={() => setActiveTab('processTypes')}
          >
            📋 Process Types
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className={styles.section}>
                <h3>User Management</h3>
                
                <div className={styles.form}>
                  <h4>Create New User</h4>
                  <form onSubmit={handleCreateUser}>
                    <input
                      type="text"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    />
                    <button type="submit">Create User</button>
                  </form>
                </div>

                <div className={styles.list}>
                  <h4>Existing Users ({users.length})</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td>{u.full_name}</td>
                          <td>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'processTypes' && (
              <div className={styles.section}>
                <h3>Process Type Management</h3>

                <div className={styles.form}>
                  <h4>Create New Process Type</h4>
                  <form onSubmit={handleCreateProcessType}>
                    <input
                      type="text"
                      placeholder="Process Type Name"
                      value={newProcessType.name}
                      onChange={(e) => setNewProcessType({...newProcessType, name: e.target.value})}
                    />
                    <textarea
                      placeholder="Description"
                      value={newProcessType.description}
                      onChange={(e) => setNewProcessType({...newProcessType, description: e.target.value})}
                    />
                    <button type="submit">Create Process Type</button>
                  </form>
                </div>

                <div className={styles.list}>
                  <h4>Existing Process Types ({processTypes.length})</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processTypes.map((pt) => (
                        <tr key={pt.id}>
                          <td>{pt.name}</td>
                          <td>{pt.description || '-'}</td>
                          <td>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteProcessType(pt.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={styles.section}>
                <h3>Settings</h3>
                <div className={styles.settings}>
                  <div className={styles.setting}>
                    <h4>Application Info</h4>
                    <p><strong>Name:</strong> Quantic Marketing Funnel CRM</p>
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
                    <p><strong>Backend:</strong> http://localhost:5000</p>
                  </div>

                  <div className={styles.setting}>
                    <h4>Your Profile</h4>
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Name:</strong> {user?.full_name}</p>
                  </div>

                  <div className={styles.setting}>
                    <h4>Database</h4>
                    <p><strong>Total Users:</strong> {users.length}</p>
                    <p><strong>Total Process Types:</strong> {processTypes.length}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
