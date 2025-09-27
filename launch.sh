#!/bin/bash

# Transportation Analytics Platform Launch Script
# This script sets up and launches the complete Transportation Analytics Platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for MySQL to be ready
wait_for_mysql() {
    print_status "Waiting for MySQL to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
            print_success "MySQL is ready!"
            return 0
        fi
        print_status "Attempt $attempt/$max_attempts - MySQL not ready yet, waiting 2 seconds..."
        sleep 2
        ((attempt++))
    done
    
    print_error "MySQL failed to start after $max_attempts attempts"
    return 1
}

# Function to setup MySQL database
setup_database() {
    print_status "Setting up MySQL database..."
    
    # Check if MySQL is running
    if ! command_exists mysql; then
        print_error "MySQL is not installed!"
        print_error ""
        
        # Check if we're on macOS and can auto-install
        if [[ "$OSTYPE" == "darwin"* ]] && command_exists brew; then
            if [ "$AUTO_INSTALL" = true ]; then
                print_status "Auto-install mode: Installing MySQL automatically..."
                INSTALL_MYSQL=true
            else
                print_error "I can install MySQL automatically for you."
                print_error ""
                read -p "Would you like me to install MySQL automatically? (y/n): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    INSTALL_MYSQL=true
                else
                    INSTALL_MYSQL=false
                fi
            fi
            
            if [ "$INSTALL_MYSQL" = true ]; then
                print_status "Installing MySQL automatically..."
                if [ -f "./install-mysql.sh" ]; then
                    # Make sure the script is executable
                    chmod +x ./install-mysql.sh
                    ./install-mysql.sh
                    if [ $? -eq 0 ]; then
                        print_success "MySQL installed successfully! Continuing..."
                        # Verify MySQL is running
                        if mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
                            print_success "MySQL is running and ready!"
                        else
                            print_warning "MySQL is installed but may need to be started."
                            print_status "Starting MySQL service..."
                            brew services start mysql
                            sleep 3
                        fi
                    else
                        print_error "MySQL installation failed. Please install manually."
                        exit 1
                    fi
                else
                    print_error "install-mysql.sh not found. Installing via Homebrew..."
                    brew install mysql
                    brew services start mysql
                    sleep 5
                    # Verify MySQL is running
                    if mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
                        print_success "MySQL installed and started!"
                    else
                        print_warning "MySQL is installed but may need configuration."
                        print_warning "You may need to set a root password:"
                        print_warning "  mysql_secure_installation"
                    fi
                fi
            else
                if [ "$AUTO_INSTALL" = false ]; then
                    print_error "MySQL installation cancelled."
                    print_error ""
                    print_error "You have two options:"
                    print_error ""
                    print_error "Option 1: Install MySQL manually"
                    print_error "  macOS: brew install mysql"
                    print_error "  Ubuntu: sudo apt-get install mysql-server"
                    print_error "  Windows: Download from https://dev.mysql.com/downloads/"
                    print_error ""
                    
                    # Check if Docker is available
                    if command_exists docker && command_exists docker-compose; then
                        print_error "Option 2: Use Docker (Recommended - No MySQL installation needed)"
                        print_error "  docker-compose up --build"
                        print_error ""
                        print_error "This will start MySQL, backend, and frontend in containers."
                    else
                        print_error "Option 2: Use Docker (Requires Docker installation)"
                        print_error "  Install Docker: https://www.docker.com/get-started"
                        print_error "  Then run: docker-compose up --build"
                    fi
                    
                    print_error ""
                    print_error "After installing MySQL or Docker, run this script again."
                    exit 1
                fi
            fi
        else
            print_error "You have two options:"
            print_error ""
            print_error "Option 1: Install MySQL manually"
            print_error "  macOS: brew install mysql"
            print_error "  Ubuntu: sudo apt-get install mysql-server"
            print_error "  Windows: Download from https://dev.mysql.com/downloads/"
            print_error ""
            
            # Check if Docker is available
            if command_exists docker && command_exists docker-compose; then
                print_error "Option 2: Use Docker (Recommended - No MySQL installation needed)"
                print_error "  docker-compose up --build"
                print_error ""
                print_error "This will start MySQL, backend, and frontend in containers."
            else
                print_error "Option 2: Use Docker (Requires Docker installation)"
                print_error "  Install Docker: https://www.docker.com/get-started"
                print_error "  Then run: docker-compose up --build"
            fi
            
            print_error ""
            print_error "After installing MySQL or Docker, run this script again."
            exit 1
        fi
    fi
    
    # Start MySQL service
    print_status "Starting MySQL service..."
    if command_exists brew; then
        # macOS with Homebrew
        brew services start mysql 2>/dev/null || true
    elif command_exists systemctl; then
        # Linux with systemd
        sudo systemctl start mysql 2>/dev/null || true
    fi
    
    # Wait for MySQL to be ready
    wait_for_mysql
    
    # Create database if it doesn't exist
    print_status "Creating database if it doesn't exist..."
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS transportation_analytics;" 2>/dev/null || {
        print_warning "Could not create database with root user. Trying with current user..."
        mysql -e "CREATE DATABASE IF NOT EXISTS transportation_analytics;" 2>/dev/null || {
            print_error "Failed to create database. Please check MySQL credentials."
            exit 1
        }
    }
    
    print_success "Database setup complete!"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install server dependencies
    if [ ! -d "server/node_modules" ]; then
        print_status "Installing server dependencies..."
        cd server
        npm install
        cd ..
        print_success "Server dependencies installed!"
    else
        print_status "Server dependencies already installed."
    fi
    
    # Install client dependencies
    if [ ! -d "client/node_modules" ]; then
        print_status "Installing client dependencies..."
        cd client
        npm install
        cd ..
        print_success "Client dependencies installed!"
    else
        print_status "Client dependencies already installed."
    fi
}

# Function to initialize database schema
init_database() {
    print_status "Initializing database schema..."
    cd server
    npm run init-db
    cd ..
    print_success "Database schema initialized!"
}

# Function to check environment files
check_environment() {
    print_status "Checking environment configuration..."
    
    # Check server environment
    if [ ! -f "server/.env" ]; then
        print_warning "Server .env file not found. Creating from example..."
        if [ -f "server/env.example" ]; then
            cp server/env.example server/.env
            # Set a proper JWT secret
            sed -i '' 's/your-super-secret-jwt-key-here/transportation-analytics-jwt-secret-key-2024/g' server/.env
            print_success "Server .env file created from example."
        else
            print_error "Server env.example file not found!"
            exit 1
        fi
    fi
    
    # Check client environment
    if [ ! -f "client/.env" ]; then
        print_warning "Client .env file not found. Creating from example..."
        if [ -f "client/env.example" ]; then
            cp client/env.example client/.env
            print_success "Client .env file created from example."
        else
            print_error "Client env.example file not found!"
            exit 1
        fi
    fi
    
    print_success "Environment configuration complete!"
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd server
    npm run start:mysql &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        # Check if process is still running
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            print_error "Backend process died unexpectedly!"
            return 1
        fi
        
        # Check if backend is responding
        if curl -s http://localhost:8081/health >/dev/null 2>&1; then
            print_success "Backend server started successfully!"
            return 0
        fi
        print_status "Attempt $attempt/$max_attempts - Backend not ready yet, waiting 2 seconds..."
        sleep 2
        ((attempt++))
    done
    
    print_error "Backend failed to start after $max_attempts attempts"
    print_error "Please check the backend logs for errors:"
    print_error "  cd server && npm run start:mysql"
    return 1
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend development server..."
    cd client
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    print_status "Waiting for frontend to start..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        # Check if process is still running
        if ! kill -0 $FRONTEND_PID 2>/dev/null; then
            print_error "Frontend process died unexpectedly!"
            return 1
        fi
        
        # Check if frontend is responding
        if curl -s http://localhost:3000 >/dev/null 2>&1; then
            print_success "Frontend server started successfully!"
            return 0
        fi
        print_status "Attempt $attempt/$max_attempts - Frontend not ready yet, waiting 2 seconds..."
        sleep 2
        ((attempt++))
    done
    
    print_error "Frontend failed to start after $max_attempts attempts"
    print_error "Please check the frontend logs for errors:"
    print_error "  cd client && npm start"
    return 1
}

# Function to open browser
open_browser() {
    local url=$1
    print_status "Opening browser to $url..."
    
    if command_exists open; then
        # macOS
        open "$url"
    elif command_exists xdg-open; then
        # Linux
        xdg-open "$url"
    elif command_exists start; then
        # Windows
        start "$url"
    else
        print_warning "Could not automatically open browser. Please manually open: $url"
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up processes..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_success "Cleanup complete!"
}

# Function to show usage
show_usage() {
    echo "Transportation Analytics Platform Launch Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --setup-only    Only setup dependencies and database, don't start servers"
    echo "  --backend-only  Only start the backend server"
    echo "  --frontend-only Only start the frontend server"
    echo "  --docker        Use Docker instead of local MySQL (recommended)"
    echo "  --auto-install  Automatically install MySQL without prompting"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Full setup and launch (requires MySQL)"
    echo "  $0 --docker        # Use Docker (no MySQL installation needed)"
    echo "  $0 --auto-install  # Auto-install MySQL and launch"
    echo "  $0 --setup-only    # Setup only"
    echo "  $0 --backend-only  # Backend only"
    echo "  $0 --frontend-only # Frontend only"
}

# Main execution
main() {
    # Parse command line arguments
    SETUP_ONLY=false
    BACKEND_ONLY=false
    FRONTEND_ONLY=false
    USE_DOCKER=false
    AUTO_INSTALL=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --setup-only)
                SETUP_ONLY=true
                shift
                ;;
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --frontend-only)
                FRONTEND_ONLY=true
                shift
                ;;
            --docker)
                USE_DOCKER=true
                shift
                ;;
            --auto-install)
                AUTO_INSTALL=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Set up trap for cleanup on exit
    trap cleanup EXIT
    
    print_status "Starting Transportation Analytics Platform setup..."
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first:"
        print_error "  Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if curl is installed (needed for health checks)
    if ! command_exists curl; then
        print_error "curl is not installed. Please install curl first:"
        print_error "  macOS: brew install curl"
        print_error "  Ubuntu: sudo apt-get install curl"
        print_error "  Windows: Download from https://curl.se/"
        exit 1
    fi
    
    # Check if Docker option is selected
    if [ "$USE_DOCKER" = true ]; then
        print_status "Docker mode selected. Starting with Docker Compose..."
        
        # Check if Docker is available
        if ! command_exists docker; then
            print_error "Docker is not installed. Please install Docker first:"
            print_error "  Visit: https://www.docker.com/get-started"
            exit 1
        fi
        
        if ! command_exists docker-compose; then
            print_error "Docker Compose is not installed. Please install Docker Compose first:"
            print_error "  Visit: https://docs.docker.com/compose/install/"
            exit 1
        fi
        
        # Start with Docker Compose
        print_status "Starting Transportation Analytics Platform with Docker..."
        docker-compose up --build
        
        # This will block until user stops with Ctrl+C
        exit 0
    fi
    
    # Install dependencies
    install_dependencies
    
    # Check environment files
    check_environment
    
    # Setup database
    setup_database
    
    # Initialize database schema
    init_database
    
    if [ "$SETUP_ONLY" = true ]; then
        print_success "Setup complete! You can now run the application manually."
        print_status "To start the application:"
        print_status "  Backend:  cd server && npm run start:mysql"
        print_status "  Frontend: cd client && npm start"
        exit 0
    fi
    
    # Check for port conflicts
    if port_in_use 8081; then
        print_warning "Port 8081 is already in use. Backend may already be running."
    fi
    
    if port_in_use 3000; then
        print_warning "Port 3000 is already in use. Frontend may already be running."
    fi
    
    # Start services based on options
    if [ "$BACKEND_ONLY" = true ]; then
        start_backend
        print_success "Backend is running at http://localhost:3001"
        print_status "Press Ctrl+C to stop the backend server."
        wait
    elif [ "$FRONTEND_ONLY" = true ]; then
        start_frontend
        print_success "Frontend is running at http://localhost:3000"
        print_status "Press Ctrl+C to stop the frontend server."
        wait
    else
        # Start both services
        start_backend
        start_frontend
        
        # Final success message with clear formatting
        echo ""
        echo "=================================================="
        print_success "🚀 Transportation Analytics Platform is now running!"
        echo "=================================================="
        echo ""
        print_status "📱 Frontend: http://localhost:3000"
        print_status "🔧 Backend:  http://localhost:8081"
        print_status "❤️  API Health: http://localhost:8081/health"
        echo ""
        print_status "Opening frontend in your browser..."
        
        # Open browser to frontend
        sleep 2  # Give frontend a moment to fully start
        
        # Final check that frontend is accessible
        if curl -s http://localhost:3000 >/dev/null 2>&1; then
            open_browser "http://localhost:3000"
        else
            print_warning "Frontend may not be fully ready yet. Please manually open: http://localhost:3000"
        fi
        
        echo ""
        print_status "Press Ctrl+C to stop all services."
        echo ""
        
        # Wait for user to stop
        print_status "Services are running. Press Ctrl+C to stop all services."
        wait
    fi
}

# Run main function with all arguments
main "$@"
