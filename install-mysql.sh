#!/bin/bash

# MySQL Installation Script for Transportation Analytics Platform
# This script installs MySQL on macOS using Homebrew

set -e

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

print_status "Installing MySQL for Transportation Analytics Platform..."

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is for macOS only."
    print_error "For other platforms, please install MySQL manually:"
    print_error "  Ubuntu: sudo apt-get install mysql-server"
    print_error "  Windows: Download from https://dev.mysql.com/downloads/"
    exit 1
fi

# Check if Homebrew is installed
if ! command_exists brew; then
    print_error "Homebrew is not installed. Please install Homebrew first:"
    print_error "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Install MySQL
print_status "Installing MySQL using Homebrew..."
brew install mysql

# Start MySQL service
print_status "Starting MySQL service..."
brew services start mysql

# Wait for MySQL to be ready
print_status "Waiting for MySQL to be ready..."
sleep 5

# Test MySQL connection
print_status "Testing MySQL connection..."
if mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
    print_success "MySQL is running successfully!"
else
    print_warning "MySQL is installed but may need configuration."
    print_warning "You may need to set a root password:"
    print_warning "  mysql_secure_installation"
fi

print_success "MySQL installation complete!"
print_status "You can now run: ./launch.sh"

