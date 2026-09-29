import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PipelineBoard from '../components/PipelineBoard';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDragEnd = (event) => {
    // Drag-drop logic will be handled by PipelineBoard component
    // This is just a top-level context provider
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.dashboard}>
        <nav className={styles.navbar}>
          <div className={styles.navLeft}>
            <h2 className={styles.logo}>Quantic</h2>
            <span className={styles.subtitle}>Marketing Funnel</span>
          </div>

          <div className={styles.navRight}>
            <span className={styles.userInfo}>
              ACTING AS{' '}
              <span className={styles.userName}>{user?.full_name}</span>
            </span>
            {user?.role === 'admin' && (
              <button
                className={styles.adminBtn}
                onClick={() => navigate('/admin')}
              >
                Admin
              </button>
            )}
            <button className={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        <div className={styles.container}>
          <PipelineBoard />
        </div>
      </div>
    </DndContext>
  );
}
