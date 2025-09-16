import React, { useEffect, useState } from 'react';
import navLogo from '../assets/navlogo.png';
import apiService from '../services/api';
import { useCars } from '../state/CarsContext';
import { processGalleryImageUrl } from '../utils/imageUtils';

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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [activeTab, setActiveTab] = useState('cars'); // 'cars' or 'gallery'
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    description: '',
    category: 'gallery',
    order: 0
  });
  const [galleryFile, setGalleryFile] = useState(null);



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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeMessage('');

    // Validate passwords
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setPasswordChangeMessage('New passwords do not match');
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      setPasswordChangeMessage('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await apiService.changePassword({
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword
      });

      if (response.success) {
        setPasswordChangeMessage('Password changed successfully!');
        setChangePasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setPasswordChangeMessage('');
        }, 2000);
      } else {
        setPasswordChangeMessage(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordChangeMessage('Failed to change password. Please try again.');
    }
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
            return `https://chalyatiindia.onrender.com${img}`; // Add backend URL
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

  // Gallery functions
  const loadGalleryImages = async () => {
    setGalleryLoading(true);
    setGalleryError('');
    try {
      const response = await apiService.getAdminGalleryImages();
      if (response.success) {
        setGalleryImages(response.data);
      } else {
        setGalleryError('Failed to load gallery images');
      }
    } catch (error) {
      console.error('Gallery load error:', error);
      setGalleryError('Failed to load gallery images');
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      alert('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('title', galleryFormData.title);
    formData.append('description', galleryFormData.description);
    formData.append('category', galleryFormData.category);
    formData.append('order', galleryFormData.order);

    try {
      const response = await apiService.uploadGalleryImage(formData);
      if (response.success) {
        setSuccessMessage('Gallery image uploaded successfully!');
        setShowGalleryUpload(false);
        setGalleryFormData({
          title: '',
          description: '',
          category: 'gallery',
          order: 0
        });
        setGalleryFile(null);
        loadGalleryImages();
      } else {
        alert(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      alert('Failed to upload image');
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await apiService.deleteGalleryImage(id);
      if (response.success) {
        setSuccessMessage('Gallery image deleted successfully!');
        loadGalleryImages();
      } else {
        alert(response.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Gallery delete error:', error);
      alert('Failed to delete image');
    }
  };

  const handleGalleryToggleActive = async (id, isActive) => {
    try {
      const response = await apiService.updateGalleryImage(id, { isActive: !isActive });
      if (response.success) {
        setSuccessMessage(`Gallery image ${!isActive ? 'activated' : 'deactivated'} successfully!`);
        loadGalleryImages();
      } else {
        alert(response.message || 'Failed to update image');
      }
    } catch (error) {
      console.error('Gallery update error:', error);
      alert('Failed to update image');
    }
  };

  // Load gallery images when tab is switched
  useEffect(() => {
    if (isLoggedIn && activeTab === 'gallery') {
      loadGalleryImages();
    }
  }, [isLoggedIn, activeTab]);

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


      <div className="admin-header">
        <div className="admin-header-content">
          <img src={navLogo} alt="CHALYATI" className="admin-logo" />
          <div className="admin-header-actions">
            <button 
              onClick={() => setShowChangePasswordModal(true)} 
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
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            Car Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery Management
          </button>
        </div>

        {/* Cars Tab Content */}
        {activeTab === 'cars' && (
          <>
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
                      ? `https://chalyatiindia.onrender.com${firstImage}`
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
          </>
        )}

        {/* Gallery Tab Content */}
        {activeTab === 'gallery' && (
          <>
            {/* Gallery Header */}
            <div className="gallery-header">
              <h2>Gallery Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowGalleryUpload(true)}
              >
                Upload New Image
              </button>
            </div>

            {/* Gallery Loading */}
            {galleryLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading gallery images...</p>
                </div>
              </div>
            )}

            {/* Gallery Error */}
            {galleryError && (
              <div className="error-message">
                {galleryError}
              </div>
            )}

            {/* Gallery Images Grid */}
            <div className="gallery-grid">
              {galleryImages.map((image) => (
                <div key={image.id} className="gallery-item-admin">
                  <div className="gallery-image-container">
                    <img 
                      src={processGalleryImageUrl(image.imageUrl)} 
                      alt={image.title}
                      className="gallery-image"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-actions">
                        <button
                          className={`btn btn-sm ${image.isActive ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleGalleryToggleActive(image.id, image.isActive)}
                        >
                          {image.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleGalleryDelete(image.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="gallery-info">
                    <h4>{image.title}</h4>
                    <p>{image.description}</p>
                    <div className="gallery-meta">
                      <span className="badge">{image.category}</span>
                      <span className="badge">Order: {image.order}</span>
                      <span className="badge">{image.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && !galleryLoading && (
              <div className="no-results">
                <p>No gallery images found. Upload some images to get started!</p>
              </div>
            )}

            {/* Gallery Upload Modal */}
            {showGalleryUpload && (
              <div className="gallery-upload-modal-overlay">
                <div className="gallery-upload-modal">
                  {/* Modal Header */}
                  <div className="gallery-upload-modal-header">
                    <div className="gallery-upload-modal-title">
                      <div className="gallery-upload-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h2>Upload New Image</h2>
                        <p>Add a new image to your gallery collection</p>
                      </div>
                    </div>
                    <button 
                      className="gallery-upload-modal-close" 
                      onClick={() => {
                        setShowGalleryUpload(false);
                        setGalleryFormData({
                          title: '',
                          description: '',
                          category: 'gallery',
                          order: 0
                        });
                        setGalleryFile(null);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="gallery-upload-modal-content">
                    <form onSubmit={handleGalleryUpload} className="gallery-upload-form">
                      <div className="gallery-upload-form-grid">
                        <div className="gallery-upload-form-group">
                          <label htmlFor="galleryTitle" className="gallery-upload-label">
                            <span>Image Title</span>
                            <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="galleryTitle"
                            className="gallery-upload-input"
                            placeholder="Enter a descriptive title for your image"
                            value={galleryFormData.title}
                            onChange={(e) => setGalleryFormData(prev => ({
                              ...prev,
                              title: e.target.value
                            }))}
                            required
                          />
                        </div>

                        <div className="gallery-upload-form-group">
                          <label htmlFor="galleryDescription" className="gallery-upload-label">
                            Description
                          </label>
                          <textarea
                            id="galleryDescription"
                            className="gallery-upload-textarea"
                            placeholder="Add a description for your image (optional)"
                            rows="3"
                            value={galleryFormData.description}
                            onChange={(e) => setGalleryFormData(prev => ({
                              ...prev,
                              description: e.target.value
                            }))}
                          />
                        </div>

                        <div className="gallery-upload-form-group">
                          <label htmlFor="galleryCategory" className="gallery-upload-label">
                            <span>Category</span>
                            <span className="required">*</span>
                          </label>
                          <select
                            id="galleryCategory"
                            className="gallery-upload-select"
                            value={galleryFormData.category}
                            onChange={(e) => setGalleryFormData(prev => ({
                              ...prev,
                              category: e.target.value
                            }))}
                          >
                            <option value="gallery">Gallery - General images</option>
                            <option value="featured">Featured - Rolling gallery images</option>
                            <option value="hero">Hero - Hero section images</option>
                          </select>
                        </div>

                        <div className="gallery-upload-form-group">
                          <label htmlFor="galleryOrder" className="gallery-upload-label">
                            Display Order
                          </label>
                          <input
                            type="number"
                            id="galleryOrder"
                            className="gallery-upload-input"
                            placeholder="0"
                            min="0"
                            value={galleryFormData.order}
                            onChange={(e) => setGalleryFormData(prev => ({
                              ...prev,
                              order: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>

                        <div className="gallery-upload-form-group gallery-upload-file-group">
                          <label htmlFor="galleryFile" className="gallery-upload-label">
                            <span>Image File</span>
                            <span className="required">*</span>
                          </label>
                          <div className="gallery-upload-file-container">
                            <input
                              type="file"
                              id="galleryFile"
                              className="gallery-upload-file-input"
                              accept="image/*"
                              onChange={(e) => setGalleryFile(e.target.files[0])}
                              required
                            />
                            <label htmlFor="galleryFile" className="gallery-upload-file-label">
                              <div className="gallery-upload-file-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14.5 4H20.5C21.6 4 22.5 4.9 22.5 6V18C22.5 19.1 21.6 20 20.5 20H4.5C3.4 20 2.5 19.1 2.5 18V6C2.5 4.9 3.4 4 4.5 4H10.5L12.5 6H14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="gallery-upload-file-text">
                                <span className="gallery-upload-file-title">
                                  {galleryFile ? galleryFile.name : 'Choose an image file'}
                                </span>
                                <span className="gallery-upload-file-subtitle">
                                  {galleryFile ? 'Click to change' : 'PNG, JPG, JPEG up to 5MB'}
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Modal Footer */}
                  <div className="gallery-upload-modal-footer">
                    <div className="gallery-upload-modal-actions">
                      <button 
                        type="button" 
                        className="gallery-upload-btn gallery-upload-btn-secondary"
                        onClick={() => {
                          setShowGalleryUpload(false);
                          setGalleryFormData({
                            title: '',
                            description: '',
                            category: 'gallery',
                            order: 0
                          });
                          setGalleryFile(null);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="gallery-upload-btn gallery-upload-btn-primary"
                        onClick={handleGalleryUpload}
                        disabled={!galleryFile || !galleryFormData.title}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Change Password</h2>
              <button 
                className="modal-close" 
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordChangeMessage('');
                  setChangePasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="modal-body">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={changePasswordData.currentPassword}
                  onChange={(e) => setChangePasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={changePasswordData.newPassword}
                  onChange={(e) => setChangePasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={changePasswordData.confirmPassword}
                  onChange={(e) => setChangePasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  required
                  minLength="6"
                />
              </div>
              {passwordChangeMessage && (
                <div className={`message ${passwordChangeMessage.includes('successfully') ? 'success' : 'error'}`}>
                  {passwordChangeMessage}
                </div>
              )}
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordChangeMessage('');
                    setChangePasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
