// Mock services for Storybook
export const mockDataService = {
  async getFleetRoutes() {
    return [
      {
        id: 1,
        name: "Route A",
        distance: 150,
        duration: 120,
        status: "active"
      },
      {
        id: 2,
        name: "Route B", 
        distance: 200,
        duration: 180,
        status: "active"
      }
    ];
  },
  async getVehicles() {
    return [
      {
        id: 1,
        make: "Ford",
        model: "Transit",
        year: 2022,
        mileage: 15000
      },
      {
        id: 2,
        make: "Chevrolet",
        model: "Express",
        year: 2021,
        mileage: 25000
      }
    ];
  },
  async getPerformanceData() {
    return [
      {
        id: 1,
        vehicleId: 1,
        date: "2024-01-15",
        fuelEfficiency: 8.5,
        maintenanceCost: 150
      },
      {
        id: 2,
        vehicleId: 2,
        date: "2024-01-16",
        fuelEfficiency: 7.8,
        maintenanceCost: 200
      }
    ];
  }
};

export const mockChartService = {
  generateChartData: (data) => data,
  createChart: (config) => ({ type: 'mock-chart', config })
};

export const mockAuthService = {
  isAuthenticated: () => true,
  getCurrentUser: () => ({ id: 1, name: "Test User", email: "test@example.com" }),
  getUser: () => ({ id: 1, name: "Test User", email: "test@example.com" }),
  getUserId: () => 1,
  getUserEmail: () => "test@example.com",
  getToken: () => "mock-jwt-token",
  
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === "test@example.com" && password === "password") {
      return { 
        success: true, 
        user: { id: 1, name: "Test User", email: "test@example.com" }
      };
    } else {
      return { 
        success: false, 
        message: "Invalid credentials" 
      };
    }
  },
  
  register: async (email, password, firstName = '', lastName = '') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      success: true, 
      user: { id: 2, name: `${firstName} ${lastName}`.trim(), email }
    };
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },
  
  validateSession: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { 
      valid: true, 
      user: { id: 1, name: "Test User", email: "test@example.com" }
    };
  },
  
  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true, token: "new-mock-jwt-token" };
  },
  
  setAuthData: (token, user) => {
    console.log('Mock: Setting auth data', { token, user });
  },
  
  clearAuthData: () => {
    console.log('Mock: Clearing auth data');
  },
  
  checkAuth: async () => {
    const result = await this.validateSession();
    return result.valid;
  }
};

export const mockNotificationService = {
  showSuccess: (message) => console.log('Success:', message),
  showError: (message) => console.log('Error:', message),
  showInfo: (message) => console.log('Info:', message),
  subscribe: (callback) => () => {},
  removeNotification: (id) => {},
  clearAllNotifications: () => {}
};

export const mockStorageService = {
  get: (key) => null,
  set: (key, value) => {},
  remove: (key) => {},
  clear: () => {}
};
