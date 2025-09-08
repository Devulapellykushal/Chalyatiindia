import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../state/CarsContext';

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cars } = useCars();
  
  // Generate filter options from cars data
  const brands = [...new Set(cars.map(car => car.brand))].sort();
  const types = [...new Set(cars.map(car => car.type))].sort();
  const transmissions = [...new Set(cars.map(car => car.transmission))].sort();
  const fuels = ["Petrol", "Diesel", "EV", "Hybrid"];

  // Get price range from cars data
  const prices = cars.map(car => car.pricePerDay).filter(price => price > 0);
  const minPrice = Math.min(...prices) || 0;
  const maxPrice = Math.max(...prices) || 100000;

  // Local state for form values
  const [localFilters, setLocalFilters] = useState({
    brand: searchParams.get('brand') || '',
    type: searchParams.get('type') || '',
    fuel: searchParams.get('fuel') || '',
    trans: searchParams.get('trans') || '',
    pmin: searchParams.get('pmin') || minPrice.toString(),
    pmax: searchParams.get('pmax') || maxPrice.toString()
  });

  // Update URL when local filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (localFilters.brand) newParams.set('brand', localFilters.brand);
    if (localFilters.type) newParams.set('type', localFilters.type);
    if (localFilters.fuel) newParams.set('fuel', localFilters.fuel);
    if (localFilters.trans) newParams.set('trans', localFilters.trans);
    if (localFilters.pmin && parseInt(localFilters.pmin) > minPrice) {
      newParams.set('pmin', localFilters.pmin);
    }
    if (localFilters.pmax && parseInt(localFilters.pmax) < maxPrice) {
      newParams.set('pmax', localFilters.pmax);
    }
    
    setSearchParams(newParams);
  }, [localFilters, setSearchParams, minPrice, maxPrice]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({
      brand: '',
      type: '',
      fuel: '',
      trans: '',
      pmin: minPrice.toString(),
      pmax: maxPrice.toString()
    });
  };

  const hasActiveFilters = localFilters.brand || 
    localFilters.type || 
    localFilters.fuel || 
    localFilters.trans || 
    parseInt(localFilters.pmin) > minPrice || 
    parseInt(localFilters.pmax) < maxPrice;

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <h3 className="filters-title">Filters</h3>
        {hasActiveFilters && (
          <button 
            className="clear-filters-btn"
            onClick={clearAllFilters}
            title="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Brand Filter */}
        <div className="filter-section">
          <label className="filter-label">
            Brand
          </label>
          <select
            className="filter-select"
            value={localFilters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="filter-section">
          <label className="filter-label">
            Vehicle Type
          </label>
          <select
            className="filter-select"
            value={localFilters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Transmission Filter */}
        <div className="filter-section">
          <label className="filter-label">
            Transmission
          </label>
          <select
            className="filter-select"
            value={localFilters.trans}
            onChange={(e) => handleFilterChange('trans', e.target.value)}
          >
            <option value="">All Transmissions</option>
            {transmissions.map(trans => (
              <option key={trans} value={trans}>{trans}</option>
            ))}
          </select>
        </div>

        {/* Fuel Filter */}
        <div className="filter-section">
          <label className="filter-label">
            Fuel Type
          </label>
          <select
            className="filter-select"
            value={localFilters.fuel}
            onChange={(e) => handleFilterChange('fuel', e.target.value)}
          >
            <option value="">All Fuel Types</option>
            {fuels.map(fuel => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <label className="filter-label">
            Price Range (₹/month)
          </label>
          <div className="price-range-container">
            <div className="price-input-group">
              <input
                type="number"
                className="price-input"
                placeholder="Min"
                value={localFilters.pmin}
                onChange={(e) => handleFilterChange('pmin', e.target.value)}
                min={minPrice}
                max={maxPrice}
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                className="price-input"
                placeholder="Max"
                value={localFilters.pmax}
                onChange={(e) => handleFilterChange('pmax', e.target.value)}
                min={minPrice}
                max={maxPrice}
              />
            </div>
            <div className="price-range-info">
              <small>Range: ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}</small>
            </div>
          </div>
        </div>

        {/* Quick Price Filters */}
        <div className="filter-section">
          <label className="filter-label">Quick Price Filters</label>
          <div className="quick-price-filters">
            <button
              className={`quick-filter-btn ${parseInt(localFilters.pmax) <= 25000 ? 'active' : ''}`}
              onClick={() => {
                setLocalFilters(prev => ({
                  ...prev,
                  pmin: minPrice.toString(),
                  pmax: '25000'
                }));
              }}
            >
              Under ₹25,000
            </button>
            <button
              className={`quick-filter-btn ${parseInt(localFilters.pmin) >= 25000 && parseInt(localFilters.pmax) <= 50000 ? 'active' : ''}`}
              onClick={() => {
                setLocalFilters(prev => ({
                  ...prev,
                  pmin: '25000',
                  pmax: '50000'
                }));
              }}
            >
              ₹25,000 - ₹50,000
            </button>
            <button
              className={`quick-filter-btn ${parseInt(localFilters.pmin) >= 50000 ? 'active' : ''}`}
              onClick={() => {
                setLocalFilters(prev => ({
                  ...prev,
                  pmin: '50000',
                  pmax: maxPrice.toString()
                }));
              }}
            >
              Above ₹50,000
            </button>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="filters-summary">
          <h4>Active Filters:</h4>
          <div className="active-filters-list">
            {localFilters.brand && (
              <span className="active-filter-tag">
                Brand: {localFilters.brand}
                <button onClick={() => handleFilterChange('brand', '')}>×</button>
              </span>
            )}
            {localFilters.type && (
              <span className="active-filter-tag">
                Type: {localFilters.type}
                <button onClick={() => handleFilterChange('type', '')}>×</button>
              </span>
            )}
            {localFilters.fuel && (
              <span className="active-filter-tag">
                Fuel: {localFilters.fuel}
                <button onClick={() => handleFilterChange('fuel', '')}>×</button>
              </span>
            )}
            {localFilters.trans && (
              <span className="active-filter-tag">
                Transmission: {localFilters.trans}
                <button onClick={() => handleFilterChange('trans', '')}>×</button>
              </span>
            )}
            {(parseInt(localFilters.pmin) > minPrice || parseInt(localFilters.pmax) < maxPrice) && (
              <span className="active-filter-tag">
                Price: ₹{parseInt(localFilters.pmin).toLocaleString()} - ₹{parseInt(localFilters.pmax).toLocaleString()}
                <button onClick={() => {
                  setLocalFilters(prev => ({
                    ...prev,
                    pmin: minPrice.toString(),
                    pmax: maxPrice.toString()
                  }));
                }}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;