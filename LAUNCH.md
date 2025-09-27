# 🚀 Quick Launch Guide

## One-Command Setup and Launch

The Transportation Analytics Platform includes a comprehensive launch script that handles everything needed to get the application running.

### **Prerequisites**

#### **Option 1: Native Installation**
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for cloning the repository)

#### **Option 2: Docker (Recommended)**
- **Docker** (v20 or higher)
- **Docker Compose** (v2 or higher)
- **Git** (for cloning the repository)

### **Quick Start**

#### **Option 1: Native Installation**
```bash
# Clone the repository
git clone https://github.com/seandifatta1/transportation-analytics-platform.git
cd transportation-analytics-platform

# Run the launch script
./launch.sh
```

That's it! The script will:
- ✅ Install all dependencies
- ✅ Set up MySQL database
- ✅ Initialize database schema
- ✅ Start both backend and frontend servers
- ✅ Open the application at http://localhost:3000

#### **Option 2: Docker (Recommended)**
```bash
# Clone the repository
git clone https://github.com/seandifatta1/transportation-analytics-platform.git
cd transportation-analytics-platform

# Start with Docker Compose
docker-compose up --build
```

Docker will:
- ✅ Set up MySQL database container
- ✅ Build and start backend container
- ✅ Build and start frontend container
- ✅ Handle all networking and dependencies
- ✅ Open the application at http://localhost:3000

### **Launch Options**

#### **Native Installation**
```bash
# Full setup and launch (default)
./launch.sh

# Setup only (no servers started)
./launch.sh --setup-only

# Backend only
./launch.sh --backend-only

# Frontend only
./launch.sh --frontend-only

# Show help
./launch.sh --help
```

#### **Docker**
```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build --force-recreate
```

### **What the Script Does**

#### **1. Dependency Installation**
- Installs server dependencies (`server/node_modules`)
- Installs client dependencies (`client/node_modules`)

#### **2. Environment Setup**
- Creates `.env` files from examples if missing
- Configures database connections
- Sets up API endpoints

#### **3. Database Setup**
- Starts MySQL service
- Creates `transportation_analytics` database
- Initializes database schema with tables
- Seeds with sample data

#### **4. Service Launch**
- Starts backend API server (port 3001)
- Starts frontend development server (port 3000)
- Waits for services to be ready
- Provides access URLs

### **Access Points**

Once launched, you can access:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **API Documentation**: See `API_DOCUMENTATION.md`

### **Troubleshooting**

#### **MySQL Issues**
```bash
# Check if MySQL is running
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Linux

# Start MySQL manually
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux
```

#### **Port Conflicts**
```bash
# Check what's using ports
lsof -i :3000  # Frontend port
lsof -i :3001  # Backend port

# Kill processes if needed
kill -9 <PID>
```

#### **Permission Issues**
```bash
# Make script executable
chmod +x launch.sh

# Run with proper permissions
./launch.sh
```

#### **Dependency Issues**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf server/node_modules client/node_modules
./launch.sh
```

### **Manual Setup (Alternative)**

If you prefer to set up manually:

```bash
# 1. Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. Setup MySQL
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux

# 3. Create database
mysql -u root -e "CREATE DATABASE transportation_analytics;"

# 4. Initialize database
cd server && npm run init-db && cd ..

# 5. Start services
# Terminal 1:
cd server && npm run start:mysql

# Terminal 2:
cd client && npm start
```

### **Development Commands**

```bash
# Run tests
cd client && npm test
cd server && npm test

# Run Storybook
cd client && npm run storybook

# Run E2E tests
cd client && npm run cypress:open

# Build for production
cd client && npm run build
```

### **Production Deployment**

For production deployment, see the individual service documentation:
- Backend: `server/README.md`
- Frontend: `client/README.md`

---

**Need Help?** Check the main `README.md` for detailed documentation or open an issue on GitHub.
