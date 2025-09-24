# Service-Based Architecture Documentation

## Overview

The Transportation Analytics Platform has been refactored to use a service-based architecture with dependency injection. This architecture improves testability, maintainability, and separation of concerns.

## Architecture Components

### 1. Service Layer

#### Core Services
- **DataService**: Handles all data operations (CRUD, analytics)
- **ChartService**: Manages chart data transformation and visualization
- **NotificationService**: Provides user feedback and notifications
- **StorageService**: Manages local and session storage
- **AuthService**: Handles authentication and user management

#### Service Interfaces
All services implement standardized interfaces defined in `src/services/types.ts`:
- `IService`: Base service interface with lifecycle methods
- `IDataService`: Data operations interface
- `IChartService`: Chart operations interface
- `INotificationService`: Notification operations interface
- `IStorageService`: Storage operations interface

### 2. Dependency Injection Container

#### ServiceContainer
- Manages service registration and resolution
- Handles service lifecycle (initialization, destruction)
- Provides service discovery and dependency injection
- Supports both singleton and transient service scopes

#### ServiceFactory
- Creates and configures service instances
- Handles service initialization order
- Provides test-specific service configurations
- Manages service dependencies

### 3. Custom Hooks

#### Service Hooks
- `useService(serviceName)`: Get a specific service
- `useServices(serviceNames)`: Get multiple services
- `useDataService()`: Get data service
- `useChartService()`: Get chart service
- `useNotificationService()`: Get notification service
- `useStorageService()`: Get storage service

#### Data Hooks
- `useData(dataType, options)`: Fetch data with loading/error states
- `useChartData(chartType, filters)`: Get chart data with caching
- `useNotifications()`: Manage notifications
- `useStorage()`: Storage operations

### 4. Component Architecture

#### Refactored Components
- **FleetPerformanceChart**: Individual chart component with service integration
- **FleetEfficiencyChart**: Efficiency analysis with service data
- **TimeSeriesChart**: Time series visualization with service data
- **FleetSummaryCards**: Summary cards with service data
- **AddPerformanceRecordRefactored**: Form component using services

#### Service Integration
- Components use custom hooks to access services
- No direct API calls in components
- Centralized error handling through services
- Consistent loading and error states

## Testing Strategy

### 1. Unit Tests
- **Service Tests**: Test individual service methods
- **Component Tests**: Test components with mocked services
- **Hook Tests**: Test custom hooks with service mocks

### 2. Integration Tests
- **Service Integration**: Test service interactions
- **Component Integration**: Test components with real services
- **End-to-End**: Test complete user flows

### 3. Mock Services
- **Test Services**: Mock implementations for testing
- **Storybook Services**: Mock services for component development
- **Cypress Fixtures**: Mock data for E2E tests

## Development Workflow

### 1. Component Development
```bash
# Start Storybook for component development
npm run storybook

# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### 2. Service Development
```bash
# Test services individually
npm run test -- --testPathPattern=services

# Test specific service
npm run test -- --testPathPattern=DataService
```

### 3. End-to-End Testing
```bash
# Open Cypress
npm run cypress:open

# Run E2E tests
npm run cypress:run
```

## Service Configuration

### 1. Environment Variables
```env
REACT_APP_BASE_URL=http://localhost:3001
```

### 2. Service Initialization
```javascript
// In App.js
<ServiceProvider config={{ baseUrl: process.env.REACT_APP_BASE_URL }}>
  <AuthProvider>
    {/* App components */}
  </AuthProvider>
</ServiceProvider>
```

### 3. Custom Service Configuration
```javascript
const factory = new ServiceFactory('http://localhost:3001');
const container = await factory.initializeServices();
```

## Best Practices

### 1. Service Design
- Single Responsibility: Each service has one clear purpose
- Interface Segregation: Services implement focused interfaces
- Dependency Inversion: Services depend on abstractions, not concretions

### 2. Component Design
- Use custom hooks for service access
- Keep components focused on UI logic
- Handle loading and error states consistently
- Use TypeScript for type safety

### 3. Testing
- Mock services for unit tests
- Use real services for integration tests
- Test error scenarios and edge cases
- Maintain high test coverage

### 4. Error Handling
- Centralized error handling in services
- User-friendly error messages
- Graceful degradation
- Proper error logging

## Migration Guide

### 1. From Direct API Calls
```javascript
// Before
const [data, setData] = useState([]);
useEffect(() => {
  axios.get('/api/data').then(response => {
    setData(response.data);
  });
}, []);

// After
const { data, loading, error } = useData('vehicles');
```

### 2. From Context Providers
```javascript
// Before
const { data } = useContext(DataContext);

// After
const dataService = useDataService();
const data = await dataService.getVehicles();
```

### 3. From Direct Storage
```javascript
// Before
localStorage.setItem('key', value);

// After
const storageService = useStorageService();
storageService.set('key', value);
```

## Performance Considerations

### 1. Service Caching
- Services implement caching for expensive operations
- Chart data is cached to avoid unnecessary recalculations
- Storage service provides TTL-based caching

### 2. Lazy Loading
- Services are initialized on demand
- Components load data as needed
- Chart data is loaded when charts are visible

### 3. Memory Management
- Services are properly destroyed on unmount
- Event listeners are cleaned up
- Cached data is cleared when appropriate

## Troubleshooting

### 1. Service Initialization Issues
- Check service dependencies
- Verify service registration order
- Check for circular dependencies

### 2. Component Not Updating
- Ensure services are properly injected
- Check for missing dependencies
- Verify service state management

### 3. Test Failures
- Check mock service implementations
- Verify test data fixtures
- Ensure proper test isolation

## Future Enhancements

### 1. Service Monitoring
- Add service performance monitoring
- Implement service health checks
- Add service usage analytics

### 2. Advanced Caching
- Implement Redis-like caching
- Add cache invalidation strategies
- Optimize cache hit rates

### 3. Service Discovery
- Add dynamic service discovery
- Implement service versioning
- Add service load balancing

## Conclusion

The service-based architecture provides a solid foundation for the Transportation Analytics Platform. It improves code organization, testability, and maintainability while providing a consistent development experience across the application.

For questions or issues, please refer to the test files and examples in the codebase, or consult the team documentation.
