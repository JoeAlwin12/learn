import React, { useState, useEffect } from 'react';
import { dealAPI, processTypeAPI } from '../services/api';
import DealCard from './DealCard';
import KanbanColumn from './KanbanColumn';
import Filters from './Filters';
import ProcessTypeTabs from './ProcessTypeTabs';
import DealModal from './DealModal';
import styles from '../styles/PipelineBoard.module.css';

const STAGES = [
  { id: 'interested', label: 'Interested — Brochure Shared', color: '#e3f2fd' },
  { id: 'requirement_confirmed', label: 'Requirement Confirmed', color: '#f3e5f5' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: '#fff3e0' },
  { id: 'negotiation', label: 'Negotiation', color: '#fce4ec' },
  { id: 'closed_won', label: 'Closed Won', color: '#e8f5e9' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ffebee' },
];

export default function PipelineBoard() {
  const [deals, setDeals] = useState([]);
  const [processTypes, setProcessTypes] = useState([]);
  const [selectedProcessType, setSelectedProcessType] = useState(null);
  const [filters, setFilters] = useState({
    country: '',
    product: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);

  // Fetch process types
  useEffect(() => {
    fetchProcessTypes();
  }, []);

  // Fetch deals when filters change
  useEffect(() => {
    if (selectedProcessType) {
      fetchDeals();
    }
  }, [selectedProcessType, filters]);

  const fetchProcessTypes = async () => {
    try {
      const response = await processTypeAPI.getAll();
      setProcessTypes(response.data);
      // Select first process type
      if (response.data.length > 0) {
        setSelectedProcessType(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load process types');
      console.error(err);
    }
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const filterParams = {
        process_type_id: selectedProcessType,
        ...(filters.country && { country: filters.country }),
        ...(filters.product && { product: filters.product }),
      };
      const response = await dealAPI.getAll(filterParams);
      setDeals(response.data);
    } catch (err) {
      setError('Failed to load deals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDealMoved = async (dealId, newStage) => {
    try {
      await dealAPI.updateStage(dealId, newStage);
      // Update local state
      setDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.id === dealId ? { ...deal, stage: newStage } : deal
        )
      );
    } catch (err) {
      setError('Failed to move deal');
      console.error(err);
      // Refresh deals to sync state
      fetchDeals();
    }
  };

  const handleOpenModal = (dealId = null) => {
    setSelectedDealId(dealId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDealId(null);
  };

  const handleDealSaved = () => {
    fetchDeals();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stage === stage.id);
    return acc;
  }, {});

  const totalDeals = deals.length;

  if (loading && deals.length === 0) {
    return (
      <div className={styles.container}>
        <div className="flex-center" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Pipeline Board</h1>
          <p className={styles.subtitle}>
            {totalDeals} deals · {selectedProcessType && 
              processTypes.find(pt => pt.id === selectedProcessType)?.name}
          </p>
        </div>
        <button 
          className={styles.newDealBtn}
          onClick={() => handleOpenModal()}
        >
          + New Deal
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Filters onFilterChange={handleFilterChange} />

      <ProcessTypeTabs
        processTypes={processTypes}
        selectedId={selectedProcessType}
        onSelect={setSelectedProcessType}
      />

      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage[stage.id]}
              onDealMoved={handleDealMoved}
              onDealClick={handleOpenModal}
            />
          ))}
        </div>
      </div>

      {modalOpen && (
        <DealModal
          dealId={selectedDealId}
          onClose={handleCloseModal}
          onSave={handleDealSaved}
        />
      )}
    </div>
  );
}
