import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import navlogo from '../assets/navlogo.png';
import Filters from '../components/Filters.jsx';
import { FocusCarCards } from '../components/FocusCarCards.js';
import { useCars } from '../state/CarsContext';

const Browse = () => {
  const { cars, loading, error, refreshCars } = useCars();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  // Extract filter parameters from URL
  const searchQuery = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const type = searchParams.get('type') || '';
  const transmission = searchParams.get('trans') || '';
  const fuel = searchParams.get('fuel') || '';
  const priceMin = parseInt(searchParams.get('pmin')) || 0;
  const priceMax = parseInt(searchParams.get('pmax')) || 100000;

  // Filter and sort cars based on criteria
  const filteredCars = useMemo(() => {
    let filtered = cars.filter(car => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchableText = `${car.title} ${car.brand} ${car.type} ${car.description || ''}`.toLowerCase();
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Brand filter
      if (brand && car.brand !== brand) {
        return false;
      }

      // Type filter
      if (type && car.type !== type) {
        return false;
      }

      // Transmission filter
      if (transmission && car.transmission !== transmission) {
        return false;
      }

      // Fuel filter
      if (fuel && car.fuel !== fuel) {
        return false;
      }

      // Price range filter
      if (car.pricePerDay < priceMin || car.pricePerDay > priceMax) {
        return false;
      }

      return true;
    });

    // Sort cars based on selected option
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
        filtered = filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [cars, searchQuery, brand, type, transmission, fuel, priceMin, priceMax, sortBy]);

  // Get active filter count
  const activeFiltersCount = [brand, type, transmission, fuel].filter(Boolean).length + 
    (priceMin > 0 ? 1 : 0) + (priceMax < 100000 ? 1 : 0);

  if (loading) {
    return (
      <div className="browse-page">
        <div className="browse-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading cars...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-page">
        <div className="browse-error">
          <h2>Error Loading Cars</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <div className="browse-layout">
        {/* Filters Sidebar */}
        <aside className={`browse-filters ${showFilters ? 'mobile-filters-open' : ''}`}>
          <Filters />
        </aside>

        {/* Main Content */}
        <main className="browse-content">
          {/* Header Section */}
          <header className="browse-header">
            <div className="browse-title-section">
              <div className="company-logo">
                <img src={navlogo} alt="CHALYATI" className="logo-image" />
                {/* <h1 className="browse-title">CHALYATI</h1> */}
              </div>
              {activeFiltersCount > 0 && (
                <div className="browse-stats">
                  <span className="active-filters">
                    {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
                  </span>
                </div>
              )}
            </div>

            {/* Sort Controls */}
            <div className="browse-controls">
              <div className="sort-controls">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <span className="results-count">
                  {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
                </span>
                <button 
                  className="refresh-btn"
                  onClick={refreshCars}
                  title="Refresh car data"
                >
                  🔄
                </button>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button 
                className="mobile-filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
                title="Toggle filters"
              >
                🔍 Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>
          </header>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="search-results-info">
              <p>
                Search results for: <strong>"{searchQuery}"</strong>
              </p>
            </div>
          )}

          {/* Cars Grid */}
          <section className="browse-results">
            {filteredCars.length > 0 ? (
              <div className="cars-grid-container">
                <FocusCarCards cars={filteredCars} />
              </div>
            ) : (
              <div className="browse-empty-state">
                <div className="empty-state-icon">🚗</div>
                <h3>No cars found</h3>
                <p>
                  {activeFiltersCount > 0 || searchQuery
                    ? "Try adjusting your filters or search terms to find more vehicles."
                    : "No cars are currently available. Please check back later."}
                </p>
                {(activeFiltersCount > 0 || searchQuery) && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.href = '/cars'}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Browse;