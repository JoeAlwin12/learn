import React, { useState, useEffect } from 'react';
import { dealAPI, userAPI, processTypeAPI } from '../services/api';
import styles from '../styles/DealModal.module.css';

export default function DealModal({ dealId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company_name: '',
    product: '',
    location: '',
    deal_value: '',
    process_type_id: '',
    team_member_ids: [],
  });

  const [allUsers, setAllUsers] = useState([]);
  const [processTypes, setProcessTypes] = useState([]);
  const [loading, setLoading] = useState(!!dealId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch data on mount
  useEffect(() => {
    fetchUsers();
    fetchProcessTypes();
    if (dealId) {
      fetchDeal();
    }
  }, [dealId]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setAllUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchProcessTypes = async () => {
    try {
      const response = await processTypeAPI.getAll();
      setProcessTypes(response.data);
    } catch (err) {
      console.error('Failed to fetch process types', err);
    }
  };

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.getById(dealId);
      const deal = response.data;
      setFormData({
        company_name: deal.company_name,
        product: deal.product || '',
        location: deal.location,
        deal_value: deal.deal_value,
        process_type_id: deal.process_type_id,
        team_member_ids: deal.team_members?.map((tm) => tm.id) || [],
      });
    } catch (err) {
      setError('Failed to load deal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.deal_value || parseFloat(formData.deal_value) <= 0) {
      newErrors.deal_value = 'Deal value must be greater than 0';
    }

    if (!formData.process_type_id) {
      newErrors.process_type_id = 'Process type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        company_name: formData.company_name,
        product: formData.product,
        location: formData.location,
        deal_value: parseFloat(formData.deal_value),
        process_type_id: formData.process_type_id,
        team_member_ids: formData.team_member_ids,
      };

      if (dealId) {
        await dealAPI.update(dealId, payload);
      } else {
        await dealAPI.create(payload);
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save deal');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!dealId) return;

    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    try {
      setSaving(true);
      await dealAPI.delete(dealId);
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete deal');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleTeamMemberToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      team_member_ids: prev.team_member_ids.includes(userId)
        ? prev.team_member_ids.filter((id) => id !== userId)
        : [...prev.team_member_ids, userId],
    }));
  };

  if (loading) {
    return (
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className="flex-center" style={{ minHeight: '200px' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{dealId ? 'Edit Deal' : 'Create New Deal'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Company Name *</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              disabled={saving}
            />
            {errors.company_name && (
              <span className={styles.fieldError}>{errors.company_name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Product</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="Enter product / solution"
              disabled={saving}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              disabled={saving}
            />
            {errors.location && (
              <span className={styles.fieldError}>{errors.location}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Deal Value (₹) *</label>
            <input
              type="number"
              name="deal_value"
              value={formData.deal_value}
              onChange={handleChange}
              placeholder="Enter deal value"
              disabled={saving}
            />
            {errors.deal_value && (
              <span className={styles.fieldError}>{errors.deal_value}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Process Type *</label>
            <select
              name="process_type_id"
              value={formData.process_type_id}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">Select process type</option>
              {processTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
            {errors.process_type_id && (
              <span className={styles.fieldError}>
                {errors.process_type_id}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Team Members</label>
            <div className={styles.teamMembersList}>
              {allUsers.map((user) => (
                <label key={user.id} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.team_member_ids.includes(user.id)}
                    onChange={() => handleTeamMemberToggle(user.id)}
                    disabled={saving}
                  />
                  <span>{user.full_name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={saving}
            >
              {saving ? 'Saving...' : dealId ? 'Update Deal' : 'Create Deal'}
            </button>

            {dealId && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete Deal'}
              </button>
            )}

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
