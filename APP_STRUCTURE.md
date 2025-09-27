# Transportation Analytics Platform - App Structure

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSPORTATION ANALYTICS PLATFORM            │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React)          │  Backend (Node.js)                │
│  ┌─────────────────────┐   │  ┌─────────────────────────────┐   │
│  │   Storybook UI     │   │  │     Express Server          │   │
│  │   (Component Dev)  │   │  │                             │   │
│  └─────────────────────┘   │  └─────────────────────────────┘   │
│  ┌─────────────────────┐   │  ┌─────────────────────────────┐   │
│  │   Main App         │   │  │     Database Layer          │   │
│  │   (Production)     │   │  │   - MySQL/Firestore        │   │
│  └─────────────────────┘   │  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Component Hierarchy

```
App.js
├── AuthContext (Authentication)
├── ServiceContext (Dependency Injection)
├── ScreenContext (Navigation State)
└── Router
    ├── Login Page
    │   ├── Login Component
    │   └── SignUp Component
    └── Protected Routes
        ├── Main Layout
        │   ├── CustomAppBar (Navigation)
        │   ├── Drawer (Sidebar)
        │   └── LogoutButton
        └── Views
            ├── Fleet Routes
            │   ├── Route List
            │   ├── Add Route Dialog
            │   └── Route Details
            ├── Vehicle Analysis
            │   ├── Vehicle List
            │   ├── Performance Metrics
            │   └── Maintenance Records
            ├── Monthly Fleet Trends
            │   ├── FleetSummaryCards
            │   ├── FleetPerformanceChart
            │   ├── FleetEfficiencyChart
            │   └── TimeSeriesChart
            └── Weekly Fleet Analysis
                ├── Weekly Metrics
                └── Trend Analysis
```

## Fundamental Components (No Internal Dependencies)

```
📊 Chart Components (Pure MUI + @mui/x-charts)
├── FleetSummaryCards
│   ├── Total Vehicles Card
│   ├── Active Vehicles Card
│   ├── Avg Fuel Efficiency Card
│   └── Total Distance Card
├── FleetPerformanceChart (Bar Chart)
├── FleetEfficiencyChart (Line Chart)
└── TimeSeriesChart (Scatter Chart)

🎨 UI Components (Pure MUI)
├── Title (Typography wrapper)
├── CustomAppBar (Navigation bar)
└── Theme definitions

🔐 Auth Components (MUI + Context)
├── Login (Form with AuthContext)
└── LogoutButton (Button with AuthContext)
```

## Service Architecture

```
ServiceContainer (Dependency Injection)
├── DataService (API calls)
├── ChartService (Chart data processing)
├── AuthService (Authentication)
├── NotificationService (Alerts/notifications)
├── StorageService (Local storage)
└── HttpClient (HTTP requests)

Hooks Layer
├── useServices (Service access)
├── useData (Data fetching)
└── useNotifications (Notification management)
```

## Data Flow

```
User Interaction
    ↓
React Component
    ↓
useServices Hook
    ↓
ServiceContainer
    ↓
HttpClient
    ↓
Express API
    ↓
Database (MySQL/Firestore)
    ↓
Response Data
    ↓
Chart Components (Visualization)
```

## Storybook Structure (Current)

```
Storybook
├── Components/Charts/
│   ├── FleetSummaryCards.stories.js
│   ├── FleetPerformanceChart.stories.js
│   ├── FleetEfficiencyChart.stories.js
│   └── TimeSeriesChart.stories.js
└── Components/
    └── Title.stories.js
```

## Key Features

- **Fleet Management**: Track vehicles, routes, and performance
- **Analytics Dashboard**: Charts and metrics for fleet optimization
- **Real-time Data**: Live updates on vehicle status and performance
- **User Authentication**: Secure login/logout system
- **Responsive Design**: Material-UI components for mobile/desktop
- **Component Development**: Storybook for isolated component testing
