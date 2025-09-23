# Transportation Analytics Platform

A comprehensive full-stack web application for transportation fleet performance tracking and analytics. Built with React 18, Material-UI, and Express.js, featuring real-time data visualization, user management, and advanced reporting capabilities.

## 🚀 Portfolio Project Overview

This project demonstrates **modern full-stack development skills** with a focus on **data visualization**, **user experience**, and **scalable architecture**. The application showcases expertise in React ecosystem, RESTful API design, and production-ready development practices.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Professional component library with custom theming
- **Redux Toolkit** - State management with modern Redux patterns
- **React Router v6** - Client-side routing and navigation
- **MUI X Charts** - Advanced data visualization components
- **Axios** - HTTP client for API communication
- **React Cookie** - Session management

### Backend
- **Express.js** - Node.js web framework
- **Firebase Firestore** - NoSQL database for real-time data
- **Firebase Auth** - User authentication and session management
- **Danfo.js** - Data processing and analysis
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation middleware

### Development & Deployment
- **Docker** - Containerization for consistent deployment
- **Git** - Version control and collaboration
- **VS Code** - Modern development environment
- **Firebase Hosting** - Cloud deployment platform

## 🎯 Key Features

### Data Visualization
- **Performance Dashboards** - Real-time fleet performance metrics
- **Time Series Analysis** - Route efficiency tracking over time
- **Comparative Analytics** - Vehicle performance comparisons
- **Interactive Charts** - Scatter plots, bar charts, and line graphs

### User Management
- **Authentication System** - Secure user login and registration
- **Session Management** - Persistent user sessions
- **Role-Based Access** - User-specific data isolation
- **Program Management** - Fleet and route organization

### Data Management
- **Real-Time Data Entry** - Quick performance logging
- **Data Validation** - Input validation and error handling
- **Historical Data** - Comprehensive data retention
- **Export Capabilities** - Data export for external analysis

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── Components/          # Reusable UI components
├── views/              # Page-level components
├── redux/              # State management
├── stylesheets/        # CSS and styling
└── dev/               # Development tools
```

### Backend Architecture
```
server/
├── src/
│   ├── routes/         # API route handlers
│   ├── datasources/    # Data source integrations
│   └── dataUtils.js    # Data processing utilities
└── test/              # Test suites
```

### Database Schema
```
users/{userId}/
├── programs/{programId}/
│   ├── sessions/{sessionId}/
│   │   └── sets/{setId}/
│   └── (program metadata)
├── exercises/{exerciseId}/
└── (user metadata)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project setup
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
   
   # Configure Firebase credentials
   # Add your Firebase config to the environment files
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

### Technical Achievements
- **Complex State Management** - Redux Toolkit with multiple context providers
- **Advanced Data Processing** - Statistical analysis with Danfo.js
- **Responsive Design** - Material-UI with custom theming
- **Real-Time Updates** - Live data synchronization
- **Performance Optimization** - Virtualized lists and efficient rendering

### Business Value
- **Data-Driven Decisions** - Comprehensive analytics for fleet management
- **User Experience** - Intuitive interface for performance tracking
- **Scalability** - Cloud-based architecture with Firebase
- **Maintainability** - Clean code structure and documentation

## 🧪 Testing Strategy

- **Unit Tests** - Component and utility function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User workflow testing
- **Performance Tests** - Load testing for data processing

## 🚀 Deployment

### Development
- Local development with hot reloading
- Firebase emulators for local testing

### Production
- Docker containerization
- Firebase Hosting for frontend
- Cloud Functions for backend
- Automated CI/CD pipeline

## 📈 Future Enhancements

- **Real-Time Notifications** - WebSocket integration
- **Advanced Analytics** - Machine learning insights
- **Mobile App** - React Native companion
- **API Documentation** - OpenAPI/Swagger integration

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development capabilities. For questions or feedback, please reach out through the contact information provided.

## 📄 License

This project is for portfolio demonstration purposes.

---

**Portfolio Focus**: This project showcases modern React development, Material-UI expertise, RESTful API design, and full-stack application architecture suitable for enterprise-level frontend development roles.
