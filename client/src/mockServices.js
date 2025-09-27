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
  getCurrentUser: () => ({ id: 1, name: "Test User" }),
  login: async () => ({ success: true }),
  logout: async () => ({ success: true })
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
