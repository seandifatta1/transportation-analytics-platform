# 🚀 Quick Start Guide

## **One-Command Launch (Recommended)**

The Transportation Analytics Platform includes a comprehensive launch system that handles everything automatically.

### **Option 1: Docker (Easiest - No Installation Required)**

```bash
# Clone and run with Docker
git clone https://github.com/seandifatta1/transportation-analytics-platform.git
cd transportation-analytics-platform
./launch.sh --docker
```

**What happens:**
- ✅ Downloads and starts MySQL container
- ✅ Builds and starts backend container  
- ✅ Builds and starts frontend container
- ✅ Opens browser to http://localhost:3000
- ✅ No local MySQL installation needed

### **Option 2: Native Installation (Full Control)**

```bash
# Clone and run natively
git clone https://github.com/seandifatta1/transportation-analytics-platform.git
cd transportation-analytics-platform
./launch.sh
```

**What happens:**
- ✅ Installs all dependencies
- ✅ Sets up MySQL database
- ✅ Initializes database schema
- ✅ Starts backend and frontend servers
- ✅ Opens browser to http://localhost:3000

## **Prerequisites**

### **For Docker (Recommended)**
- **Docker** (v20 or higher)
- **Docker Compose** (v2 or higher)
- **Git** (for cloning)

### **For Native Installation**
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for cloning)

## **Installation Help**

### **MySQL Installation (macOS)**
```bash
# Automatic installation
./install-mysql.sh

# Manual installation
brew install mysql
brew services start mysql
```

### **Docker Installation**
- **macOS**: Download from [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Ubuntu**: `sudo apt-get install docker.io docker-compose`
- **Windows**: Download from [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## **Launch Options**

```bash
# Full setup and launch (requires MySQL)
./launch.sh

# Use Docker (no MySQL installation needed)
./launch.sh --docker

# Setup only (no servers started)
./launch.sh --setup-only

# Backend only
./launch.sh --backend-only

# Frontend only
./launch.sh --frontend-only

# Show help
./launch.sh --help
```

## **What You Get**

After running the launch script, you'll have:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Database**: MySQL with sample transportation data

## **Troubleshooting**

### **MySQL Issues**
```bash
# Check if MySQL is running
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Linux

# Start MySQL manually
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux
```

### **Docker Issues**
```bash
# Check if Docker is running
docker --version
docker-compose --version

# Start Docker Desktop (macOS/Windows)
# Or start Docker service (Linux)
sudo systemctl start docker
```

### **Port Conflicts**
```bash
# Check what's using ports
lsof -i :3000  # Frontend port
lsof -i :3001  # Backend port

# Kill processes if needed
kill -9 <PID>
```

### **Permission Issues**
```bash
# Make scripts executable
chmod +x launch.sh install-mysql.sh

# Run with proper permissions
./launch.sh
```

## **Development Commands**

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

## **Production Deployment**

For production deployment, see the individual service documentation:
- Backend: `server/README.md`
- Frontend: `client/README.md`

---

**Need Help?** Check the main `README.md` for detailed documentation or open an issue on GitHub.

