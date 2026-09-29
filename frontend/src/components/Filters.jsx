import React, { useState } from 'react';
import styles from '../styles/Filters.module.css';

export default function Filters({ onFilterChange }) {
  const [country, setCountry] = useState('');
  const [product, setProduct] = useState('');

  const handleCountryChange = (value) => {
    setCountry(value);
    onFilterChange({ country: value, product });
  };

  const handleProductChange = (value) => {
    setProduct(value);
    onFilterChange({ country, product: value });
  };

  const handleClear = () => {
    setCountry('');
    setProduct('');
    onFilterChange({ country: '', product: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        <select
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className={styles.select}
        >
          <option value="">All Countries</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Odisha">Odisha</option>
          <option value="Telangana">Telangana</option>
          <option value="UP">UP</option>
          <option value="Maharashtra">Maharashtra</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <select
          value={product}
          onChange={(e) => handleProductChange(e.target.value)}
          className={styles.select}
        >
          <option value="">All Products</option>
          <option value="Cement">Cement</option>
          <option value="Ports">Ports</option>
          <option value="Aluminium">Aluminium</option>
          <option value="Industries">Industries</option>
          <option value="Power">Power</option>
          <option value="Steel">Steel</option>
        </select>
      </div>

      {(country || product) && (
        <button onClick={handleClear} className={styles.clearBtn}>
          Clear Filters
        </button>
      )}
    </div>
  );
}
