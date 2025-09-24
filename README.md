# Transportation Analytics Platform

A comprehensive full-stack web application for transportation fleet performance tracking and analytics. Built with React 18, Material-UI, and Express.js, featuring real-time data visualization, user management, and advanced reporting capabilities.

## 🚀 Portfolio Project Overview

This project demonstrates **modern full-stack development skills** with a focus on **data visualization**, **user experience**, and **scalable architecture**. The application showcases expertise in React ecosystem, RESTful API design, and production-ready development practices.

**Portfolio Focus**: This project showcases modern React development, Material-UI expertise, RESTful API design, and full-stack application architecture suitable for enterprise-level frontend development roles.

**Portfolio Strategy**: This project demonstrates frontend and full-stack skills, while the companion [Enterprise Task Management API](https://github.com/yourusername/enterprise-analytics-api) showcases enterprise Java development and Spring Boot expertise.

## 🎯 Transportation Domain Context

### **Fleet Performance Analytics**
- **Vehicle Performance Tracking** - Monitor individual vehicle metrics and efficiency
- **Route Optimization** - Analyze route performance and identify improvement opportunities  
- **Driver Performance** - Track driver efficiency and safety metrics
- **Maintenance Scheduling** - Predictive maintenance based on usage patterns
- **Fuel Efficiency** - Monitor and optimize fuel consumption across the fleet

### **Data Visualization Capabilities**
- **Performance Dashboards** - Real-time fleet performance metrics and KPIs
- **Time Series Analysis** - Route efficiency tracking over time periods
- **Comparative Analytics** - Vehicle-to-vehicle and route-to-route comparisons
- **Interactive Charts** - Scatter plots for efficiency analysis, bar charts for performance metrics
- **Trend Analysis** - Identify patterns and anomalies in fleet operations

## 🛠️ Technology Stack

### Frontend Excellence
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Professional component library with custom theming
- **Redux Toolkit** - State management with modern Redux patterns
- **React Router v6** - Client-side routing and navigation
- **MUI X Charts** - Advanced data visualization components
- **Axios** - HTTP client for API communication
- **React Cookie** - Session management

### Backend Architecture
- **Express.js** - Node.js web framework with RESTful API design
- **MySQL** - Relational database for enterprise data management
- **JWT Authentication** - Token-based user authentication and session management
- **Danfo.js** - Data processing and statistical analysis
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation middleware

### Development & Deployment
- **Docker** - Containerization for consistent deployment
- **Git** - Version control and collaboration
- **VS Code** - Modern development environment
- **Cloud-agnostic deployment** - Docker containers deployable anywhere

## 🎯 Key Features

### **Transportation-Specific Features**
- **Fleet Management** - Organize vehicles by type, route, and performance metrics
- **Route Analytics** - Track route efficiency, distance, and time performance
- **Performance Logging** - Quick entry of vehicle performance data
- **Historical Analysis** - Long-term trend analysis for fleet optimization
- **Multi-User Support** - Fleet managers, drivers, and analysts can access relevant data

### **Data Visualization**
- **Performance Dashboards** - Real-time fleet performance metrics
- **Time Series Analysis** - Route efficiency tracking over time
- **Comparative Analytics** - Vehicle performance comparisons
- **Interactive Charts** - Scatter plots, bar charts, and line graphs
- **Virtualized Lists** - Efficient rendering of large vehicle/route datasets

### **User Management**
- **Authentication System** - Secure user login and registration
- **Session Management** - Persistent user sessions
- **Role-Based Access** - User-specific data isolation
- **Program Management** - Fleet and route organization

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── Components/          # Reusable UI components
│   ├── Chart.js        # Data visualization components
│   ├── AddPerformanceRecord.js # Performance data entry
│   └── globals.js      # Global styling and theming
├── views/              # Page-level components
│   ├── WeeklyFleetAnalysis.js # Weekly fleet performance analysis
│   ├── MonthlyFleetTrends.js  # Monthly fleet performance trends
│   └── VehicleAnalysis.js     # Individual vehicle performance analysis
├── redux/              # State management
│   ├── dataSlice.js    # Fleet performance data state
│   └── uiSlice.js      # UI state management
└── stylesheets/        # CSS and styling
```

### Backend Architecture
```
server/
├── src/
│   ├── routes/         # API route handlers
│   │   ├── userRouter.js    # User management
│   │   ├── fleetRouteRouter.js # Fleet route management
│   │   └── performanceRecordRouter.js # Performance data
│   ├── datasources/    # Data source integrations
│   └── dataUtils.js    # Data processing utilities
└── test/              # Test suites
```

### Data Model (Transportation Context)

The application uses a transportation-focused data model that maps fitness concepts to fleet management:

| Fitness Concept | Transportation Concept | Description |
|----------------|----------------------|-------------|
| **Exercises** | **Vehicles** | Individual vehicles in the fleet (Truck-001, Van-002, etc.) |
| **Programs** | **Fleet Routes** | Route categories (City Delivery, Long Haul, Local Pickup) |
| **Sessions** | **Route Sessions** | Specific route runs (Route A - Morning Run, Route B - Afternoon) |
| **Sets** | **Performance Records** | Individual performance measurements (fuel efficiency, speed, distance) |

**Sample Data Structure:**
```javascript
{
  vehicles: [
    { id: "vehicle-001", name: "Truck-001", type: "DELIVERY", capacity: "5T" },
    { id: "vehicle-002", name: "Van-002", type: "PICKUP", capacity: "2T" }
  ],
  fleetRoutes: [
    { id: "route-001", name: "City Delivery", type: "CITY_ROUTES", description: "Urban delivery routes" },
    { id: "route-002", name: "Long Haul", type: "LONG_HAUL", description: "Interstate transportation" }
  ],
  routeSessions: [
    { id: "session-001", name: "Morning Delivery", routeId: "route-001", date: "2024-01-15" }
  ],
  performanceRecords: [
    { 
      id: "record-001", 
      sessionId: "session-001", 
      vehicleId: "vehicle-001",
      metricName: "fuel_efficiency", 
      metricValue: 8.5, 
      unit: "mpg",
      timestamp: "2024-01-15T08:00:00Z"
    }
  ]
}
```

### Database Schema (Transportation Context)
```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'DRIVER') DEFAULT 'DRIVER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fleet programs table
CREATE TABLE programs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    type ENUM('CITY_ROUTES', 'LONG_HAUL', 'DELIVERY') DEFAULT 'CITY_ROUTES',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Route sessions table
CREATE TABLE sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    program_id BIGINT NOT NULL,
    route_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Performance records table
CREATE TABLE performance_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transportation-analytics-platform
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp local-dev.env.example local-dev.env
   cp production.env.example production.env
   
   # Configure database connection
   # Update MySQL connection details in environment files
   ```

4. **Start development servers**
   ```bash
   # Backend (Port 8081)
   cd server
   npm start
   
   # Frontend (Port 3000)
   cd client
   npm start
   ```

## 📊 Portfolio Highlights

### **Technical Achievements**
- **Complex State Management** - Redux Toolkit with multiple context providers for fleet data
- **Advanced Data Processing** - Statistical analysis with Danfo.js for performance metrics
- **Responsive Design** - Material-UI with custom theming for professional fleet management interface
- **Real-Time Updates** - Live data synchronization for fleet operations
- **Performance Optimization** - Virtualized lists and efficient rendering for large datasets

### **Transportation Industry Value**
- **Data-Driven Fleet Management** - Comprehensive analytics for transportation operations
- **Route Optimization** - Identify efficiency improvements and cost savings
- **Performance Tracking** - Monitor vehicle and driver performance metrics
- **Scalable Architecture** - Cloud-agnostic solution supporting fleet growth
- **User Experience** - Intuitive interface for fleet managers and analysts

### **Modern Development Practices**
- **Component Architecture** - Reusable, maintainable React components
- **API Design** - RESTful endpoints with proper error handling
- **Authentication** - Secure user management with Firebase Auth
- **Data Validation** - Input validation and error handling throughout
- **Code Organization** - Clean, well-structured codebase with clear separation of concerns

## 🧪 Testing Strategy

- **Unit Tests** - Component and utility function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User workflow testing for fleet management operations
- **Performance Tests** - Load testing for data processing

## 🚀 Deployment

### Development
- Local development with hot reloading
- MySQL database for local testing
- Docker Compose for local services

### Production
- Docker containerization
- MySQL database cluster
- Express.js backend deployment
- Cloud-agnostic deployment
- Automated CI/CD pipeline

## 📈 Future Enhancements

- **Real-Time Notifications** - WebSocket integration for fleet alerts
- **Advanced Analytics** - Machine learning insights for predictive maintenance
- **Mobile App** - React Native companion for drivers
- **API Documentation** - OpenAPI/Swagger integration
- **Integration** - Connect with existing fleet management systems

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development capabilities for transportation industry applications. For questions or feedback, please reach out through the contact information provided.

## 📄 License

This project is for portfolio demonstration purposes.

---

**Portfolio Focus**: This project showcases modern React development, Material-UI expertise, RESTful API design, and full-stack application architecture suitable for enterprise-level frontend development roles in transportation and logistics industries.