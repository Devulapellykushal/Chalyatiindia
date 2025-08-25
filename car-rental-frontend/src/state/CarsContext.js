import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { seedCars } from '../store/seed';

const CarsContext = createContext();

const initialState = {
  cars: [],
  lastId: 0
};

const carsReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_CARS':
      return {
        cars: action.payload,
        lastId: action.payload.length
      };
    case 'ADD_CAR':
      const newCar = {
        ...action.payload,
        id: String(state.lastId + 1)
      };
      return {
        cars: [...state.cars, newCar],
        lastId: state.lastId + 1
      };
    case 'UPDATE_CAR':
      return {
        ...state,
        cars: state.cars.map(car => 
          car.id === action.payload.id ? action.payload : car
        )
      };
    case 'DELETE_CAR':
      return {
        ...state,
        cars: state.cars.filter(car => car.id !== action.payload)
      };
    default:
      return state;
  }
};

export const CarsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carsReducer, initialState);

  // Initialize cars from localStorage or seed data
  useEffect(() => {
    // Force load from seed data for now to debug
    console.log('Seed cars available:', seedCars.length);
    console.log('Seed cars:', seedCars);
    
    // Temporarily force load from seed data
    dispatch({ type: 'INIT_CARS', payload: seedCars });
    
    // Comment out localStorage logic for debugging
    /*
    const savedCars = localStorage.getItem('cars-state-v2');
    if (savedCars) {
      try {
        const parsed = JSON.parse(savedCars);
        console.log('Loading cars from localStorage:', parsed.cars.length);
        dispatch({ type: 'INIT_CARS', payload: parsed.cars });
      } catch (error) {
        console.error('Error parsing saved cars:', error);
        console.log('Loading cars from seed data:', seedCars.length);
        dispatch({ type: 'INIT_CARS', payload: seedCars });
      }
    } else {
      console.log('No saved cars found, loading from seed data:', seedCars.length);
      dispatch({ type: 'INIT_CARS', payload: seedCars });
    }
    */
  }, []);

  // Persist to localStorage whenever cars change
  useEffect(() => {
    localStorage.setItem('cars-state-v2', JSON.stringify({ // Updated version
      cars: state.cars,
      lastId: state.lastId
    }));
  }, [state.cars, state.lastId]);

  const addCar = (carData) => {
    dispatch({ type: 'ADD_CAR', payload: carData });
  };

  const updateCar = (carData) => {
    dispatch({ type: 'UPDATE_CAR', payload: carData });
  };

  const deleteCar = (carId) => {
    dispatch({ type: 'DELETE_CAR', payload: carId });
  };

  const value = {
    cars: state.cars,
    addCar,
    updateCar,
    deleteCar
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
