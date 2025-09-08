import React, { useEffect, useState } from 'react';
import navLogo from '../assets/navlogo.png';
import apiService from '../services/api';
import { useCars } from '../state/CarsContext';

const Admin = () => {
  const { cars, addCar, updateCar, deleteCar, loading, error, clearError, refreshCars } = useCars();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    type: '',
    transmission: '',
    fuel: '',
    pricePerDay: '',
    seats: '',
    mileageKm: '',
    yearOfManufacture: '',
    ownerName: '',
    contactNumber: '',
    images: '',
    featured: false,
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');



  // Dynamically generate options from actual cars data
  const brands = [...new Set(cars.map(car => car.brand))].sort();
  const types = [...new Set(cars.map(car => car.type))].sort();
  const transmissions = [...new Set(cars.map(car => car.transmission))].sort();
  const fuels = ["Petrol", "Diesel", "EV", "Hybrid", "CNG"];
  
  // Add default options if no cars exist
  const defaultBrands = ['Renault', 'Honda', 'Suzuki', 'Toyota', 'Tata', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Audi', 'BMW', 'Ford', 'Nissan', 'Volkswagen', 'Skoda', 'Mahindra'];
  const defaultTypes = ['Hatchback', 'Sedan', 'SUV', 'MPV', 'Coupe', 'Convertible', 'Wagon'];
  const defaultTransmissions = ['Manual', 'Automatic', 'CVT', 'AMT'];
  
  const availableBrands = brands.length > 0 ? brands : defaultBrands;
  const availableTypes = types.length > 0 ? types : defaultTypes;
  const availableTransmissions = transmissions.length > 0 ? transmissions : defaultTransmissions;
  
  // Dashboard statistics
  const totalCars = cars.length;
  const featuredCars = cars.filter(car => car.featured).length;
  const totalValue = cars.reduce((sum, car) => sum + (car.pricePerDay || 0), 0);
  const avgPrice = totalCars > 0 ? Math.round(totalValue / totalCars) : 0;
  
  // Filtered cars - sorted by most recently updated first
  const filteredCars = cars
    .filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || car.type === filterType;
      const matchesBrand = filterBrand === 'all' || car.brand === filterBrand;
      return matchesSearch && matchesType && matchesBrand;
    })
    .sort((a, b) => {
      // Sort by updatedAt in descending order (most recent first)
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

  // Check if user is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('admin-token');
    if (adminToken) {
      // Verify token is still valid by making a test request
      apiService.getAdminDashboard()
        .then(() => {
          setIsLoggedIn(true);
          apiService.setToken(adminToken);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('admin-token');
          localStorage.removeItem('admin-session');
          apiService.setToken(null);
          setIsLoggedIn(false);
        });
    }
  }, []);

  // Auto-hide success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-hide error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use username if provided, otherwise fallback to 'admin' for backward compatibility
      const loginUsername = username.trim() || 'admin';
      const response = await apiService.adminLogin(loginUsername, password);
      
      if (response.success && response.token) {
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
        localStorage.setItem('admin-session', 'true');
        localStorage.setItem('admin-token', response.token);
        apiService.setToken(response.token);
        setSuccessMessage(`Login successful! Welcome ${response.admin.username || 'admin'}.`);
      } else {
        alert('Incorrect credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check if the backend server is running and your credentials are correct.');
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend logout to clear server-side session
      await apiService.adminLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local cleanup even if backend logout fails
    } finally {
      // Always clear local state
      setIsLoggedIn(false);
      localStorage.removeItem('admin-session');
      localStorage.removeItem('admin-token');
      apiService.setToken(null);
      resetForm();
      clearError();
      setSuccessMessage('');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    try {
      // Basic validation
      if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('All fields are required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New password and confirmation do not match');
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters long');
        return;
      }

      // Call API to change password
      const response = await apiService.changeAdminPassword(passwordData);
      
      if (response.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setPasswordSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordChange(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    // Only take the first file (single image)
    const singleFile = validFiles[0];
    
    if (!singleFile) return;

    setSelectedFiles([singleFile]);

    // Create preview URL
    const preview = URL.createObjectURL(singleFile);
    setImagePreview([preview]);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setImagePreview(newPreviews);
  };

  const handleImageModeChange = (mode) => {
    setImageInputMode(mode);
    // Clear the other input when switching modes
    if (mode === 'upload') {
      setFormData(prev => ({ ...prev, images: '' }));
    } else {
      setSelectedFiles([]);
      setImagePreview([]);
    }
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
      yearOfManufacture: '',
      ownerName: '',
      contactNumber: '',
      images: '',
      featured: false,
      description: ''
    });
    setSelectedFiles([]);
    setImagePreview([]);
    setImageInputMode('upload');
    setEditingCar(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate image input
    if (imageInputMode === 'upload' && selectedFiles.length === 0) {
      alert('Please select an image file or switch to URL mode.');
      return;
    }
    if (imageInputMode === 'url' && !formData.images.trim()) {
      alert('Please enter an image URL or switch to upload mode.');
      return;
    }
    
    try {
      let success = false;
      
      // Prepare data based on input mode
      const carData = { ...formData };
      const filesToUpload = imageInputMode === 'upload' ? selectedFiles : [];
      
      // Log the data being sent for debugging
      console.log('Submitting car data:', carData);
      console.log('Files to upload:', filesToUpload);
      
      if (editingCar) {
        success = await updateCar({ ...carData, id: editingCar.id }, filesToUpload);
        if (success) {
          setSuccessMessage('Car updated successfully!');
          await refreshCars(); // Refresh the cars list
        }
      } else {
        success = await addCar(carData, filesToUpload);
        if (success) {
          setSuccessMessage('Car added successfully!');
          await refreshCars(); // Refresh the cars list
        }
      }
      
      if (success) {
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
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
      yearOfManufacture: car.yearOfManufacture?.toString() || '',
      ownerName: car.ownerName || '',
      contactNumber: car.contactNumber || '',
      images: Array.isArray(car.images) ? car.images.join(', ') : car.images,
      featured: car.featured,
      description: car.description
    });
    
    // Determine if existing images are URLs or uploaded files
    if (car.images && car.images.length > 0) {
      const firstImage = Array.isArray(car.images) ? car.images[0] : car.images;
      
      // Check if it's a URL (starts with http) or an uploaded file path
      if (firstImage.startsWith('http')) {
        setImageInputMode('url');
        setImagePreview([]);
        setSelectedFiles([]);
      } else {
        setImageInputMode('upload');
        // Construct full URLs for existing images
        const fullImageUrls = car.images.map(img => {
          if (img.startsWith('http')) {
            return img; // Already a full URL
          } else if (img.startsWith('/uploads/')) {
            return `http://localhost:5000${img}`; // Add backend URL
          } else {
            return img; // Keep as is for other cases
          }
        });
        setImagePreview(fullImageUrls);
        setSelectedFiles([]);
      }
    } else {
      setImagePreview([]);
      setSelectedFiles([]);
      setImageInputMode('upload');
    }
    setShowForm(true);
    
    // Scroll to the form section
    setTimeout(() => {
      const formElement = document.querySelector('.admin-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      try {
        const success = await deleteCar(carId);
        if (success) {
          setSuccessMessage('Car deleted successfully!');
          await refreshCars(); // Refresh the cars list
        }
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  // Notification components
  const Notification = ({ message, type, onClose }) => (
    <div className={`notification ${type}`}>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login">
          <div className="admin-login-container">
            <div className="admin-login-card">
              <div className="admin-login-header">
                <h1>Admin Portal</h1>
                <p>Access the car rental management system</p>
              </div>
              <form onSubmit={handleLogin} className="admin-login-form">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Login to Admin Panel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Notifications */}
      {error && (
        <Notification 
          message={error} 
          type="error" 
          onClose={clearError}
        />
      )}
      {successMessage && (
        <Notification 
          message={successMessage} 
          type="success" 
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Change Password</h2>
              <button 
                onClick={resetPasswordForm} 
                className="modal-close"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              {passwordError && (
                <div className="error-message">
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="success-message">
                  {passwordSuccess}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  className="form-input"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input
                  type="password"
                  className="form-input"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
                <div className="password-requirements">
                  <small>Password must be at least 8 characters with uppercase, lowercase, number, and special character</small>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input
                  type="password"
                  className="form-input"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={resetPasswordForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div className="admin-header-content">
          <img src={navLogo} alt="CHALYATI" className="admin-logo" />
          <div className="admin-header-actions">
            <button 
              onClick={() => setShowPasswordChange(true)} 
              className="btn btn-outline"
            >
              Change Password
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Loading State */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading cars data...</p>
            </div>
          </div>
        )}

        {/* Dashboard Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">Total</div>
            <div className="stat-content">
              <h3>Total Cars</h3>
              <p className="stat-number">{totalCars}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Featured</div>
            <div className="stat-content">
              <h3>Featured Cars</h3>
              <p className="stat-number">{featuredCars}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Value</div>
            <div className="stat-content">
              <h3>Total Value</h3>
              <p className="stat-number">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Average</div>
            <div className="stat-content">
              <h3>Avg. Price/Day</h3>
              <p className="stat-number">₹{avgPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
          >
            {showForm ? 'Close Form' : 'Add New Car'}
          </button>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-secondary"
            disabled={!editingCar}
          >
            Edit Mode
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="admin-form">
            <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
            <form onSubmit={handleSubmit} className="car-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Car title"
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
                    {availableBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
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
                    {availableTypes.map(type => (
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
                    {availableTransmissions.map(trans => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
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
                  <label className="form-label">Price per Month (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    min="0"
                    max="100000"
                    placeholder="5000"
                    required
                  />
                  <small className="form-help-text">Maximum: ₹100,000 per month</small>
                </div>
              </div>

              <div className="form-row">
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
                    placeholder="5"
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
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Year of Manufacture</label>
                  <input
                    type="number"
                    className="form-input"
                    name="yearOfManufacture"
                    value={formData.yearOfManufacture}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    placeholder="2024"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Owner Name</label>
                  <input
                    type="text"
                    className="form-input"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Owner name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-input"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Contact number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Car Images</label>
                
                {/* Image Input Mode Toggle */}
                <div className="image-mode-toggle">
                  <button
                    type="button"
                    className={`mode-toggle-btn ${imageInputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => handleImageModeChange('upload')}
                  >
                    📁 Upload File
                  </button>
                  <button
                    type="button"
                    className={`mode-toggle-btn ${imageInputMode === 'url' ? 'active' : ''}`}
                    onClick={() => handleImageModeChange('url')}
                  >
                    🔗 Image URL
                  </button>
                </div>

                {/* Upload Mode */}
                {imageInputMode === 'upload' && (
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="image-upload"
                      className="file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="image-upload" className="file-upload-label">
                      <span className="upload-icon">📷</span>
                      <span className="upload-text">
                        {selectedFiles.length > 0 
                          ? `${selectedFiles.length} file(s) selected` 
                          : 'Choose Image (Max 5MB)'
                        }
                      </span>
                    </label>
                    
                    {/* Image Previews */}
                    {imagePreview.length > 0 && (
                      <div className="image-previews">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`}
                              className="preview-image"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* URL Mode */}
                {imageInputMode === 'url' && (
                  <div className="url-input-container">
                    <input
                      type="text"
                      className="form-input"
                      name="images"
                      value={formData.images}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <small className="form-help-text">
                      Enter a direct URL to an image file (jpg, png, gif, etc.)
                    </small>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the car's features and benefits..."
                />
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Featured Car
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (editingCar ? 'Update Car' : 'Add Car')}
                </button>
                {editingCar && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search cars by title or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Brands</option>
              {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cars List */}
        <div className="cars-list">
          <h2>Car Inventory ({filteredCars.length} of {totalCars})</h2>
          <div className="cars-grid">
            {filteredCars.map(car => {
              // Get the first image for display
              const firstImage = car.images && car.images.length > 0 ? car.images[0] : null;
              const imageUrl = firstImage 
                ? (firstImage.startsWith('http') 
                    ? firstImage 
                    : firstImage.startsWith('/uploads/') 
                      ? `http://localhost:5000${firstImage}`
                      : firstImage)
                : '/img/placeholder.svg';
              
              console.log('Admin panel - Car:', car.title, 'Images:', car.images, 'ImageUrl:', imageUrl);
              
              return (
              <div key={car.id} className="car-item">
                <div className="car-item-image">
                  <img 
                    src={imageUrl} 
                    alt={car.title}
                    onError={(e) => {
                      console.error(`Admin panel - Failed to load image for ${car.title}: ${imageUrl}`, e);
                      e.target.src = '/img/placeholder.svg';
                    }}
                    onLoad={() => {
                      console.log(`Admin panel - Successfully loaded image for ${car.title}: ${imageUrl}`);
                    }}
                  />
                </div>
                <div className="car-item-header">
                  <h3>{car.title}</h3>
                  <div className="car-badges">
                    {car.featured && <span className="badge featured">Featured</span>}
                    <span className="badge type">{car.type}</span>
                    <span className="badge brand">{car.brand}</span>
                  </div>
                </div>
                <div className="car-item-details">
                  <p><strong>Price:</strong> ₹{car.pricePerDay}/month</p>
                  <p><strong>Seats:</strong> {car.seats}</p>
                  <p><strong>Transmission:</strong> {car.transmission}</p>
                  <p><strong>Fuel:</strong> {car.fuel}</p>
                  <p><strong>Mileage:</strong> {car.mileageKm.toLocaleString()} km</p>
                  {car.yearOfManufacture && (
                    <p><strong>Year:</strong> {car.yearOfManufacture}</p>
                  )}
                  {car.ownerName && (
                    <p><strong>Owner:</strong> {car.ownerName}</p>
                  )}
                </div>
                <div className="car-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(car)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(car.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              );
            })}
          </div>
          {filteredCars.length === 0 && (
            <div className="no-results">
              <p>No cars found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
