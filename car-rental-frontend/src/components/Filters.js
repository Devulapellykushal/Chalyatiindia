import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter options - updated with new cars
  const brands = [
    "Toyota", "BMW", "Tata", "Hyundai", "Mahindra", "Maruti", "Kia", "Honda", "MG", "Skoda", "Volkswagen", "Renault",
    "Mercedes-Benz", "Audi", "Tesla", "Ford", "Porsche", "Land Rover", "Lexus", "Volvo", "Jaguar", "Bentley", "Rolls-Royce", "Lamborghini"
  ];
  const types = ["Sedan", "SUV", "Hatchback", "Sports", "Luxury", "Supercar"];
  const transmissions = ["Manual", "Automatic"];
  const fuels = ["Petrol", "Diesel", "EV", "Hybrid"];

  // Local state for form values
  const [localFilters, setLocalFilters] = useState({
    brand: searchParams.get('brand') || '',
    type: searchParams.get('type') || '',
    fuel: searchParams.get('fuel') || '',
    trans: searchParams.get('trans') || '',
    pmin: searchParams.get('pmin') || '0',
    pmax: searchParams.get('pmax') || '100000'
  });

  // Update URL when local filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (localFilters.brand) newParams.set('brand', localFilters.brand);
    if (localFilters.type) newParams.set('type', localFilters.type);
    if (localFilters.fuel) newParams.set('fuel', localFilters.fuel);
    if (localFilters.trans) newParams.set('trans', localFilters.trans);
    if (localFilters.pmin && localFilters.pmin !== '0') newParams.set('pmin', localFilters.pmin);
    if (localFilters.pmax && localFilters.pmax !== '100000') newParams.set('pmax', localFilters.pmax);
    
    setSearchParams(newParams);
  }, [localFilters, setSearchParams]);

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
      pmin: '0',
      pmax: '100000'
    });
  };

  const hasActiveFilters = localFilters.brand || localFilters.type || localFilters.fuel || 
                          localFilters.trans || localFilters.pmin !== '0' || localFilters.pmax !== '100000';

  return (
    <div className="filters-sidebar">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label className="filter-label">Brand</label>
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

      <div className="filter-group">
        <label className="filter-label">Type</label>
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

      <div className="filter-group">
        <label className="filter-label">Transmission</label>
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

      <div className="filter-group">
        <label className="filter-label">Fuel Type</label>
        <select
          className="filter-select"
          value={localFilters.fuel}
          onChange={(e) => handleFilterChange('fuel', e.target.value)}
        >
          <option value="">All Fuels</option>
          {fuels.map(fuel => (
            <option key={fuel} value={fuel}>{fuel}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Price Range (₹/day)</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            className="filter-input"
            placeholder="Min"
            value={localFilters.pmin}
            onChange={(e) => handleFilterChange('pmin', e.target.value)}
            min="0"
          />
          <input
            type="number"
            className="filter-input"
            placeholder="Max"
            value={localFilters.pmax}
            onChange={(e) => handleFilterChange('pmax', e.target.value)}
            min="0"
          />
        </div>
        <div className="price-hint">
          <small>Range: ₹1,000 - ₹20,000+</small>
        </div>
      </div>

      {hasActiveFilters && (
        <button 
          className="clear-filters" 
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default Filters;
