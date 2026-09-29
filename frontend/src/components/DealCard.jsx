import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '../styles/DealCard.module.css';

export default function DealCard({ deal, onStageChange, onDealClick }) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCardClick = () => {
    if (onDealClick) {
      onDealClick(deal.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.card}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cardHeader}>
        <div className={styles.title}>{deal.company_name}</div>
        <button
          className={styles.menuBtn}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>
      </div>

      <div className={styles.location}>{deal.location}</div>

      {deal.deal_value && (
        <div className={styles.value}>
          {formatCurrency(deal.deal_value)}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.owner}>
          <span className={styles.ownerAvatar}>
            {deal.owner_name?.charAt(0).toUpperCase()}
          </span>
          <span className={styles.ownerName}>{deal.owner_name}</span>
        </div>
      </div>

      {showMenu && (
        <div className={styles.menu}>
          <button onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
            setShowMenu(false);
          }}>
            Edit
          </button>
          <button onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
            setShowMenu(false);
          }}>
            View
          </button>
          <button onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
