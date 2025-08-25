import React, { useState } from 'react';
import { useCars } from '../state/CarsContext';

const Admin = () => {
  const { cars, addCar, updateCar, deleteCar } = useCars();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    type: '',
    transmission: '',
    fuel: '',
    pricePerDay: '',
    seats: '',
    mileageKm: '',
    images: '',
    featured: false,
    description: ''
  });

  const brands = ["Toyota", "BMW", "Tata", "Hyundai", "Mahindra", "Maruti", "Kia", "Honda", "MG", "Skoda", "Volkswagen", "Renault"];
  const types = ["Sedan", "SUV", "Hatchback"];
  const transmissions = ["Manual", "Automatic"];
  const fuels = ["Petrol", "Diesel", "EV"];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
      setPassword('');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      brand: '',
      type: '',
      transmission: '',
      fuel: '',
      pricePerDay: '',
      seats: '',
      mileageKm: '',
      images: '',
      featured: false,
      description: ''
    });
    setEditingCar(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const carData = {
      ...formData,
      pricePerDay: parseInt(formData.pricePerDay),
      seats: parseInt(formData.seats),
      mileageKm: parseInt(formData.mileageKm),
      images: formData.images ? formData.images.split(',').map(url => url.trim()) : []
    };

    if (editingCar) {
      updateCar({ ...carData, id: editingCar.id });
    } else {
      addCar(carData);
    }
    
    resetForm();
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      title: car.title,
      brand: car.brand,
      type: car.type,
      transmission: car.transmission,
      fuel: car.fuel,
      pricePerDay: car.pricePerDay.toString(),
      seats: car.seats.toString(),
      mileageKm: car.mileageKm.toString(),
      images: car.images.join(', '),
      featured: car.featured,
      description: car.description
    });
  };

  const handleDelete = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCar(carId);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="main">
        <div className="container">
          <div className="admin-login">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="container">
        <h1>Admin Panel</h1>
        
        {/* Add/Edit Form */}
        <div className="admin-form">
          <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Brand *</label>
                <select
                  className="form-select"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Transmission *</label>
                <select
                  className="form-select"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Transmission</option>
                  {transmissions.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Fuel *</label>
                <select
                  className="form-select"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Fuel</option>
                  {fuels.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Price per Day (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Seats *</label>
                <input
                  type="number"
                  className="form-input"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Mileage (km) *</label>
                <input
                  type="number"
                  className="form-input"
                  name="mileageKm"
                  value={formData.mileageKm}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URLs (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                Featured Car
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Car description..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCar ? 'Update Car' : 'Add Car'}
              </button>
              {editingCar && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Inventory List */}
        <div>
          <h2>Current Inventory ({cars.length} cars)</h2>
          <div className="inventory-list">
            {cars.map(car => (
              <div key={car.id} className="inventory-card">
                <h3>{car.title}</h3>
                <p><strong>Brand:</strong> {car.brand} | <strong>Type:</strong> {car.type}</p>
                <p><strong>Price:</strong> ₹{car.pricePerDay}/day | <strong>Seats:</strong> {car.seats}</p>
                <p><strong>Transmission:</strong> {car.transmission} | <strong>Fuel:</strong> {car.fuel}</p>
                {car.featured && <span className="featured-badge">Featured</span>}
                
                <div className="inventory-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEdit(car)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(car.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
