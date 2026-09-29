import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [username, setUsername] = useState('joe');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      navigate('/');
    } else {
      setLocalError(error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1>Quantic Marketing Funnel</h1>
          <p>Customer Communication Platform</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              required
            />
          </div>

          {localError && <div className={styles.error}>{localError}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Demo Users:</p>
          <ul>
            <li><strong>joe</strong> / password123</li>
            <li><strong>senthil</strong> / password123</li>
            <li><strong>cto_viewer</strong> / password123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
