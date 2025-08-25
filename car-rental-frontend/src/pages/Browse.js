import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../components/Filters';
import { FocusCarCards } from '../components/FocusCarCards';
import { useCars } from '../state/CarsContext';

const Browse = () => {
  const { cars } = useCars();
  const [searchParams] = useSearchParams();

  // Debug logging
  console.log('=== BROWSE COMPONENT DEBUG ===');
  console.log('Total cars loaded:', cars.length);
  console.log('Cars array:', cars);
  console.log('Cars type:', typeof cars);
  console.log('Is cars array?', Array.isArray(cars));
  console.log('First car:', cars[0]);
  console.log('==============================');

  // Get filter parameters from URL
  const searchQuery = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const type = searchParams.get('type') || '';
  const transmission = searchParams.get('trans') || '';
  const fuel = searchParams.get('fuel') || '';
  const priceMin = parseInt(searchParams.get('pmin')) || 0;
  const priceMax = parseInt(searchParams.get('pmax')) || 100000;

  // Filter cars based on search and filter criteria
  const filteredCars = useMemo(() => {
    const filtered = cars.filter(car => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchableText = `${car.title} ${car.brand} ${car.type}`.toLowerCase();
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

    console.log('Filtered cars:', filtered);
    console.log('Active filters:', { brand, type, transmission, fuel, priceMin, priceMax });
    
    return filtered;
  }, [cars, searchQuery, brand, type, transmission, fuel, priceMin, priceMax]);

  return (
    <div className="main">
      <div className="container">
        <div className="browse-container">
          <Filters />
          
          <div className="results-section">
            <div className="results-header">
              <h1>Browse Cars</h1>
              <div className="results-count">
                {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {searchQuery && (
              <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Search results for: <strong>"{searchQuery}"</strong>
              </div>
            )}

            {filteredCars.length > 0 ? (
              <div className="focus-cards-container">
                <FocusCarCards cars={filteredCars} />
              </div>
            ) : (
              <div className="empty-state">
                <h3>No cars found</h3>
                <p>Try adjusting your filters or search terms to find more vehicles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
