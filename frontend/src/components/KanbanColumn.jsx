import React from 'react';
import {
  useDroppable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/core';
import DealCard from './DealCard';
import styles from '../styles/KanbanColumn.module.css';

export default function KanbanColumn({ stage, deals, onDealMoved, onDealClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
      ref={setNodeRef}
      style={{ backgroundColor: stage.color }}
    >
      <div className={styles.columnHeader}>
        <h3>{stage.label}</h3>
        <span className={styles.count}>{deals.length}</span>
      </div>

      <SortableContext
        items={deals.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.dealsList}>
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onStageChange={(newStage) => onDealMoved(deal.id, newStage)}
              onDealClick={onDealClick}
            />
          ))}
          {deals.length === 0 && (
            <div className={styles.empty}>
              <p>No deals</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
