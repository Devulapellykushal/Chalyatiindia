const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin-token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('admin-token', token);
    } else {
      localStorage.removeItem('admin-token');
    }
  }

  getHeaders(includeContentType = true) {
    const headers = {};

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for httpOnly tokens
      ...options,
    };

    try {
      console.log('Making API request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('API response:', data);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          // Clear invalid token
          this.setToken(null);
          localStorage.removeItem('admin-session');
          window.location.href = '/admin';
          throw new Error('Authentication failed. Please login again.');
        }
        
        // Handle rate limiting
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        }
        
        // Handle validation errors specifically
        if (response.status === 400 && data.errors && Array.isArray(data.errors)) {
          throw new Error(`Validation error: ${data.errors.join(', ')}`);
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Car API methods
  async getCars(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/cars?${queryString}` : '/cars';
    return this.request(endpoint);
  }

  async getCarById(id) {
    return this.request(`/cars/${id}`);
  }

  async getFeaturedCars(limit = 6) {
    return this.request(`/cars/featured?limit=${limit}`);
  }

  async getCarStats() {
    return this.request('/cars/stats');
  }

  async getCarOptions() {
    return this.request('/cars/options');
  }

  async createCar(carData) {
    return this.request('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id, carData) {
    return this.request(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id) {
    return this.request(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFeatured(id) {
    return this.request(`/cars/${id}/featured`, {
      method: 'PATCH',
    });
  }

  async updateCarStatus(id, status) {
    return this.request(`/cars/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Admin API methods
  async adminLogin(username, password) {
    const response = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminCars(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/cars?${queryString}` : '/admin/cars';
    return this.request(endpoint);
  }

  async adminCreateCar(carData, files = []) {
    if (files && files.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      console.log('Creating FormData with files:', files.length);
      
      // Add form fields
      Object.keys(carData).forEach(key => {
        if (key === 'featured') {
          formData.append(key, carData[key]);
        } else if (key === 'images' && typeof carData[key] === 'string') {
          // Skip images field if it's a string (URL mode)
          return;
        } else {
          formData.append(key, carData[key]);
        }
      });
      
      // Add files
      files.forEach(file => {
        console.log('Adding file to FormData:', file.name, file.type);
        formData.append('images', file);
      });
      
      return this.request('/admin/cars', {
        method: 'POST',
        headers: this.getHeaders(false), // Don't include Content-Type for FormData
        body: formData,
      });
    } else {
      // Regular JSON request
      return this.request('/admin/cars', {
        method: 'POST',
        body: JSON.stringify(carData),
      });
    }
  }

  async adminUpdateCar(id, carData, files = []) {
    if (files && files.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add form fields
      Object.keys(carData).forEach(key => {
        if (key === 'featured') {
          formData.append(key, carData[key]);
        } else {
          formData.append(key, carData[key]);
        }
      });
      
      // Add files
      files.forEach(file => {
        formData.append('images', file);
      });
      
      return this.request(`/admin/cars/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(false), // Don't include Content-Type for FormData
        body: formData,
      });
    } else {
      // Regular JSON request
      return this.request(`/admin/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(carData),
      });
    }
  }

  async adminDeleteCar(id) {
    return this.request(`/admin/cars/${id}`, {
      method: 'DELETE',
    });
  }

  async adminToggleFeatured(id) {
    return this.request(`/admin/cars/${id}/featured`, {
      method: 'PATCH',
    });
  }

  async seedDatabase() {
    return this.request('/admin/seed', {
      method: 'POST',
    });
  }

  async clearDatabase() {
    return this.request('/admin/clear', {
      method: 'DELETE',
    });
  }

  async initializeAdmin() {
    return this.request('/admin/init', {
      method: 'POST',
    });
  }

  async getAdminProfile() {
    return this.request('/admin/profile');
  }

  async adminLogout() {
    const response = await this.request('/admin/logout', {
      method: 'POST'
    });
    // Clear local token after successful logout
    this.setToken(null);
    localStorage.removeItem('admin-session');
    return response;
  }


  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
