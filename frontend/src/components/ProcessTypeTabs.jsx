import React from 'react';
import styles from '../styles/ProcessTypeTabs.module.css';

export default function ProcessTypeTabs({ processTypes, selectedId, onSelect }) {
  return (
    <div className={styles.container}>
      {processTypes.map((processType) => (
        <button
          key={processType.id}
          className={`${styles.tab} ${selectedId === processType.id ? styles.active : ''}`}
          onClick={() => onSelect(processType.id)}
        >
          {processType.name}
        </button>
      ))}
    </div>
  );
}
