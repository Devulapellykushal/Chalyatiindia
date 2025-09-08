import React, { createContext, useContext, useEffect, useReducer } from 'react';
import apiService from '../services/api';

const CarsContext = createContext();

const initialState = {
  cars: [],
  lastId: 0,
  loading: false,
  error: null
};

const carsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'INIT_CARS':
      return {
        ...state,
        cars: action.payload,
        lastId: action.payload.length,
        loading: false,
        error: null
      };
    case 'ADD_CAR':
      const newCar = {
        ...action.payload,
        id: String(state.lastId + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        cars: [...state.cars, newCar],
        lastId: state.lastId + 1,
        error: null
      };
    case 'UPDATE_CAR':
      return {
        ...state,
        cars: state.cars.map(car => 
          car.id === action.payload.id 
            ? { ...action.payload, updatedAt: new Date().toISOString() }
            : car
        ),
        error: null
      };
    case 'DELETE_CAR':
      return {
        ...state,
        cars: state.cars.filter(car => car.id !== action.payload),
        error: null
      };
    case 'BULK_UPDATE':
      return {
        ...state,
        cars: action.payload,
        error: null
      };
    default:
      return state;
  }
};

export const CarsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carsReducer, initialState);

  // Initialize cars from API
  useEffect(() => {
    const initializeCars = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear ALL localStorage keys related to cars
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('cars')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      try {
        const response = await apiService.getCars();
        
        if (response.success) {
          dispatch({ type: 'INIT_CARS', payload: response.data });
        } else {
          throw new Error(response.message || 'Failed to fetch cars');
        }
      } catch (error) {
        console.error('Error fetching cars from API:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cars data. Please check if the backend server is running.' });
      }
    };

    initializeCars();
  }, []);

  // Persist to localStorage whenever cars change
  useEffect(() => {
    if (state.cars.length > 0) {
      try {
        localStorage.setItem('cars-state-v2', JSON.stringify({
          cars: state.cars,
          lastId: state.lastId
        }));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save data locally' });
      }
    }
  }, [state.cars, state.lastId]);

  // Validation function
  const validateCarData = (carData) => {
    const errors = [];
    
    if (!carData.title || carData.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters long');
    }
    
    if (!carData.brand || carData.brand.trim().length === 0) {
      errors.push('Brand is required');
    }
    
    if (!carData.type || carData.type.trim().length === 0) {
      errors.push('Type is required');
    }
    
    if (!carData.transmission || carData.transmission.trim().length === 0) {
      errors.push('Transmission is required');
    }
    
    if (!carData.fuel || carData.fuel.trim().length === 0) {
      errors.push('Fuel type is required');
    }
    
    if (!carData.pricePerDay || isNaN(carData.pricePerDay) || carData.pricePerDay < 0) {
      errors.push('Price per month must be a positive number');
    }
    
    if (!carData.seats || isNaN(carData.seats) || carData.seats < 1 || carData.seats > 10) {
      errors.push('Seats must be between 1 and 10');
    }
    
    if (!carData.mileageKm || isNaN(carData.mileageKm) || carData.mileageKm < 0) {
      errors.push('Mileage must be a positive number');
    }
    
    return errors;
  };

  const addCar = async (carData, files = []) => {
    try {
      const errors = validateCarData(carData);
      if (errors.length > 0) {
        dispatch({ type: 'SET_ERROR', payload: errors.join(', ') });
        return false;
      }
      
      // Process car data - don't process images here, let the API handle it
      const processedCarData = {
        title: carData.title?.trim() || '',
        brand: carData.brand?.trim() || '',
        type: carData.type?.trim() || '',
        transmission: carData.transmission?.trim() || '',
        fuel: carData.fuel?.trim() || '',
        pricePerDay: parseInt(carData.pricePerDay) || 0,
        seats: parseInt(carData.seats) || 5,
        mileageKm: parseInt(carData.mileageKm) || 0,
        yearOfManufacture: carData.yearOfManufacture ? parseInt(carData.yearOfManufacture) : null,
        ownerName: carData.ownerName?.trim() || '',
        contactNumber: carData.contactNumber?.trim() || '',
        description: carData.description?.trim() || '',
        featured: Boolean(carData.featured)
      };
      
      // Only add images if not uploading files
      if (!files || files.length === 0) {
        if (carData.images && typeof carData.images === 'string') {
          processedCarData.images = carData.images.split(',').map(img => img.trim()).filter(img => img);
        }
      }
      
      // Try API first, fallback to local state
      try {
        // Check if user is admin (has token)
        const isAdmin = localStorage.getItem('admin-token') || localStorage.getItem('admin-session');
        console.log('Is admin:', isAdmin);
        
        const response = isAdmin 
          ? await apiService.adminCreateCar(processedCarData, files)
          : await apiService.createCar(processedCarData);
        
        console.log('API response:', response);
        
        if (response.success) {
          dispatch({ type: 'ADD_CAR', payload: response.data });
          return true;
        } else {
          throw new Error(response.message || 'Failed to create car');
        }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        dispatch({ type: 'SET_ERROR', payload: apiError.message });
        return false;
      }
    } catch (error) {
      console.error('Error adding car:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add car' });
      return false;
    }
  };

  const updateCar = async (carData, files = []) => {
    try {
      const errors = validateCarData(carData);
      if (errors.length > 0) {
        dispatch({ type: 'SET_ERROR', payload: errors.join(', ') });
        return false;
      }
      
      // Process car data - don't process images here, let the API handle it
      const processedCarData = {
        title: carData.title?.trim() || '',
        brand: carData.brand?.trim() || '',
        type: carData.type?.trim() || '',
        transmission: carData.transmission?.trim() || '',
        fuel: carData.fuel?.trim() || '',
        pricePerDay: parseInt(carData.pricePerDay) || 0,
        seats: parseInt(carData.seats) || 5,
        mileageKm: parseInt(carData.mileageKm) || 0,
        yearOfManufacture: carData.yearOfManufacture ? parseInt(carData.yearOfManufacture) : null,
        ownerName: carData.ownerName?.trim() || '',
        contactNumber: carData.contactNumber?.trim() || '',
        description: carData.description?.trim() || '',
        featured: Boolean(carData.featured)
      };
      
      // Only add images if not uploading files
      if (!files || files.length === 0) {
        if (carData.images && typeof carData.images === 'string') {
          processedCarData.images = carData.images.split(',').map(img => img.trim()).filter(img => img);
        }
      }
      
      // Try API first, fallback to local state
      try {
        // Check if user is admin (has token)
        const isAdmin = localStorage.getItem('admin-token') || localStorage.getItem('admin-session');
        const response = isAdmin 
          ? await apiService.adminUpdateCar(carData.id, processedCarData, files)
          : await apiService.updateCar(carData.id, processedCarData);
        
        if (response.success) {
          dispatch({ type: 'UPDATE_CAR', payload: response.data });
          return true;
        }
      } catch (apiError) {
        console.warn('API call failed, using local state:', apiError);
        dispatch({ type: 'UPDATE_CAR', payload: processedCarData });
        return true;
      }
    } catch (error) {
      console.error('Error updating car:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update car' });
      return false;
    }
  };

  const deleteCar = async (carId) => {
    try {
      // Try API first, fallback to local state
      try {
        // Check if user is admin (has token)
        const isAdmin = localStorage.getItem('admin-token') || localStorage.getItem('admin-session');
        const response = isAdmin 
          ? await apiService.adminDeleteCar(carId)
          : await apiService.deleteCar(carId);
        
        if (response.success) {
          dispatch({ type: 'DELETE_CAR', payload: carId });
          return true;
        }
      } catch (apiError) {
        console.warn('API call failed, using local state:', apiError);
        dispatch({ type: 'DELETE_CAR', payload: carId });
        return true;
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete car' });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const refreshCars = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear ALL localStorage keys related to cars
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('cars')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      const response = await apiService.getCars();
      
      if (response.success) {
        dispatch({ type: 'INIT_CARS', payload: response.data });
      }
    } catch (error) {
      console.error('Error refreshing cars:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh cars data' });
    }
  };

  const getCarById = (id) => {
    return state.cars.find(car => car.id === id);
  };

  const getCarsByBrand = (brand) => {
    return state.cars.filter(car => car.brand === brand);
  };

  const getCarsByType = (type) => {
    return state.cars.filter(car => car.type === type);
  };

  const getFeaturedCars = () => {
    return state.cars.filter(car => car.featured);
  };

  const getCarsByPriceRange = (minPrice, maxPrice) => {
    return state.cars.filter(car => 
      car.pricePerDay >= minPrice && car.pricePerDay <= maxPrice
    );
  };

  const searchCars = (query) => {
    const searchTerm = query.toLowerCase();
    return state.cars.filter(car =>
      car.title.toLowerCase().includes(searchTerm) ||
      car.brand.toLowerCase().includes(searchTerm) ||
      car.description?.toLowerCase().includes(searchTerm)
    );
  };

  // Additional utility functions for filtering and statistics
  const getCarsByTransmission = (transmission) => {
    return state.cars.filter(car => car.transmission === transmission);
  };

  const getCarsByFuelType = (fuelType) => {
    return state.cars.filter(car => car.fuel === fuelType);
  };

  const getCarsByYearRange = (minYear, maxYear) => {
    return state.cars.filter(car => 
      car.yearOfManufacture && 
      car.yearOfManufacture >= minYear && 
      car.yearOfManufacture <= maxYear
    );
  };

  const getCarsByMileageRange = (minMileage, maxMileage) => {
    return state.cars.filter(car => 
      car.mileageKm >= minMileage && car.mileageKm <= maxMileage
    );
  };

  const getAvailableBrands = () => {
    return [...new Set(state.cars.map(car => car.brand))].sort();
  };

  const getAvailableTypes = () => {
    return [...new Set(state.cars.map(car => car.type))].sort();
  };

  const getAvailableTransmissions = () => {
    return [...new Set(state.cars.map(car => car.transmission))].sort();
  };

  const getAvailableFuelTypes = () => {
    return [...new Set(state.cars.map(car => car.fuel))].sort();
  };

  const getPriceStatistics = () => {
    if (state.cars.length === 0) return { min: 0, max: 0, average: 0, median: 0 };
    
    const prices = state.cars
      .map(car => car.pricePerDay)
      .filter(price => price > 0)
      .sort((a, b) => a - b);
    
    if (prices.length === 0) return { min: 0, max: 0, average: 0, median: 0 };
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
    const median = prices.length % 2 === 0 
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)];
    
    return { min, max, average, median };
  };

  const getInventoryStats = () => {
    const totalCars = state.cars.length;
    const featuredCars = state.cars.filter(car => car.featured).length;
    const totalValue = state.cars.reduce((sum, car) => sum + (car.pricePerDay || 0), 0);
    const avgPrice = totalCars > 0 ? Math.round(totalValue / totalCars) : 0;
    
    const brandStats = {};
    const typeStats = {};
    const transmissionStats = {};
    const fuelStats = {};
    
    state.cars.forEach(car => {
      brandStats[car.brand] = (brandStats[car.brand] || 0) + 1;
      typeStats[car.type] = (typeStats[car.type] || 0) + 1;
      transmissionStats[car.transmission] = (transmissionStats[car.transmission] || 0) + 1;
      fuelStats[car.fuel] = (fuelStats[car.fuel] || 0) + 1;
    });
    
    return {
      totalCars,
      featuredCars,
      totalValue,
      avgPrice,
      brandStats,
      typeStats,
      transmissionStats,
      fuelStats
    };
  };

  const value = {
    cars: state.cars,
    loading: state.loading,
    error: state.error,
    addCar,
    updateCar,
    deleteCar,
    clearError,
    refreshCars,
    getCarById,
    getCarsByBrand,
    getCarsByType,
    getFeaturedCars,
    getCarsByPriceRange,
    searchCars,
    getCarsByTransmission,
    getCarsByFuelType,
    getCarsByYearRange,
    getCarsByMileageRange,
    getAvailableBrands,
    getAvailableTypes,
    getAvailableTransmissions,
    getAvailableFuelTypes,
    getPriceStatistics,
    getInventoryStats
  };

  return (
    <CarsContext.Provider value={value}>
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (!context) {
    throw new Error('useCars must be used within a CarsProvider');
  }
  return context;
};
