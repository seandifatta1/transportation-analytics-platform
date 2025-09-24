describe('Service Architecture Integration', () => {
  beforeEach(() => {
    // Mock the services for testing
    cy.intercept('GET', '**/vehicles', { fixture: 'vehicles.json' }).as('getVehicles');
    cy.intercept('GET', '**/fleet-routes', { fixture: 'fleetRoutes.json' }).as('getFleetRoutes');
    cy.intercept('GET', '**/performance-records', { fixture: 'performanceRecords.json' }).as('getPerformanceRecords');
    cy.intercept('POST', '**/performance-records', { statusCode: 201, body: { success: true } }).as('createPerformanceRecord');
    cy.intercept('POST', '**/auth/login', { statusCode: 200, body: { success: true, user: { id: '1', email: 'test@test.com' } } }).as('login');
  });

  it('should initialize services on app load', () => {
    cy.visit('/');
    
    // Check that the service initialization loading screen appears
    cy.contains('Initializing services...').should('be.visible');
    
    // Wait for services to initialize
    cy.wait('@getVehicles');
    cy.wait('@getFleetRoutes');
    
    // Should redirect to login
    cy.url().should('include', '/login');
  });

  it('should handle service initialization errors gracefully', () => {
    // Mock service initialization failure
    cy.intercept('GET', '**/vehicles', { statusCode: 500, body: { error: 'Service unavailable' } }).as('getVehiclesError');
    
    cy.visit('/');
    
    // Should show error message
    cy.contains('Service Initialization Error').should('be.visible');
    cy.contains('Service unavailable').should('be.visible');
    
    // Should have retry button
    cy.contains('Retry').should('be.visible');
  });

  it('should use services for data fetching in components', () => {
    // Login first
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    
    // Should redirect to dashboard
    cy.url().should('include', '/Dashboard/ThisWeek');
    
    // Check that data is loaded via services
    cy.wait('@getVehicles');
    cy.wait('@getFleetRoutes');
    cy.wait('@getPerformanceRecords');
    
    // Should show fleet data
    cy.contains('Weekly Fleet Summary').should('be.visible');
  });

  it('should use notification service for user feedback', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    
    // Navigate to add performance record
    cy.get('[data-testid="add-performance-record"]').click();
    
    // Fill out form
    cy.get('select[name="vehicleId"]').select('Truck-001');
    cy.get('select[name="metricName"]').select('fuel_efficiency');
    cy.get('input[name="metricValue"]').type('8.5');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    cy.wait('@createPerformanceRecord');
    
    // Should show success notification
    cy.contains('Performance record added successfully').should('be.visible');
  });

  it('should use storage service for persistence', () => {
    // Login and navigate to dashboard
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    
    // Check that user data is stored
    cy.window().its('localStorage').should('have.property', 'jwtToken');
    cy.window().its('localStorage').should('have.property', 'user');
  });

  it('should handle service errors gracefully in components', () => {
    // Mock service error
    cy.intercept('GET', '**/performance-records', { statusCode: 500, body: { error: 'Database error' } }).as('getPerformanceRecordsError');
    
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    cy.wait('@getPerformanceRecordsError');
    
    // Should show error notification
    cy.contains('Failed to load performance data').should('be.visible');
  });

  it('should use chart service for data visualization', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    cy.wait('@getVehicles');
    cy.wait('@getPerformanceRecords');
    
    // Should render charts using chart service
    cy.get('[data-testid="fleet-performance-chart"]').should('be.visible');
    cy.get('[data-testid="fleet-efficiency-chart"]').should('be.visible');
    cy.get('[data-testid="fleet-summary-cards"]').should('be.visible');
  });

  it('should handle service container lifecycle correctly', () => {
    cy.visit('/');
    
    // Services should initialize
    cy.contains('Initializing services...').should('be.visible');
    
    // Navigate away and back
    cy.visit('/login');
    cy.visit('/');
    
    // Services should reinitialize
    cy.contains('Initializing services...').should('be.visible');
  });
});
