#!/bin/bash

# ERP System Quick Setup Script
# This script helps set up the ERP system development environment

echo "🚀 ERP System Quick Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo ""
echo "🔍 Checking Prerequisites..."
echo "----------------------------"

# Check Java
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F. '{print $1}')
    if [ "$JAVA_VERSION" -ge 17 ]; then
        print_status "Java $JAVA_VERSION found"
    else
        print_warning "Java version should be 17 or higher. Found: $JAVA_VERSION"
    fi
else
    print_error "Java not found. Please install Java 21"
    echo "  Download from: https://adoptium.net/"
fi

# Check Maven
if command_exists mvn; then
    MVN_VERSION=$(mvn -version 2>/dev/null | head -n 1 | awk '{print $3}')
    print_status "Maven $MVN_VERSION found"
else
    print_error "Maven not found. Please install Maven 3.8+"
    echo "  Download from: https://maven.apache.org/download.cgi"
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 16 ]; then
        print_status "Node.js v$(node --version | cut -d'v' -f2) found"
    else
        print_warning "Node.js version should be 16 or higher. Found: v$(node --version | cut -d'v' -f2)"
    fi
else
    print_error "Node.js not found. Please install Node.js 18+"
    echo "  Download from: https://nodejs.org/"
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "npm $NPM_VERSION found"
else
    print_error "npm not found. Please install npm"
fi

# Check MySQL
if command_exists mysql; then
    print_status "MySQL found"
else
    print_warning "MySQL not found. Please install MySQL 8.0+"
    echo "  macOS: brew install mysql"
    echo "  Ubuntu: sudo apt install mysql-server"
    echo "  Windows: Download from https://dev.mysql.com/downloads/"
fi

echo ""
echo "🗄️  Database Setup"
echo "------------------"

read -p "Do you want to create the database? (y/N): " create_db
if [[ $create_db =~ ^[Yy]$ ]]; then
    read -p "Enter MySQL root password: " -s mysql_password
    echo ""
    
    print_info "Creating database 'erpdb'..."
    mysql -u root -p$mysql_password -e "CREATE DATABASE IF NOT EXISTS erpdb;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_status "Database created successfully"
        
        print_info "Running database schema..."
        mysql -u root -p$mysql_password erpdb < implementation/database/mysql_schema.sql 2>/dev/null
        
        if [ $? -eq 0 ]; then
            print_status "Database schema loaded successfully"
        else
            print_error "Failed to load database schema"
        fi
    else
        print_error "Failed to create database. Please check your MySQL credentials"
    fi
else
    print_info "Skipping database setup"
fi

echo ""
echo "🔧 Backend Setup"
echo "----------------"

cd implementation/backend

read -p "Do you want to set up the backend? (y/N): " setup_backend
if [[ $setup_backend =~ ^[Yy]$ ]]; then
    print_info "Compiling backend..."
    mvn clean compile -q
    
    if [ $? -eq 0 ]; then
        print_status "Backend compiled successfully"
        
        print_info "Running tests..."
        mvn test -q
        
        if [ $? -eq 0 ]; then
            print_status "All tests passed"
        else
            print_warning "Some tests failed"
        fi
    else
        print_error "Backend compilation failed"
    fi
else
    print_info "Skipping backend setup"
fi

cd ../..

echo ""
echo "🎨 Frontend Setup"
echo "-----------------"

cd implementation/frontend

read -p "Do you want to set up the frontend? (y/N): " setup_frontend
if [[ $setup_frontend =~ ^[Yy]$ ]]; then
    print_info "Installing frontend dependencies..."
    npm install --silent
    
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
    fi
else
    print_info "Skipping frontend setup"
fi

cd ../..

echo ""
echo "🎉 Setup Complete!"
echo "=================="

print_info "To start the application:"
echo ""
echo "1. Start MySQL:"
echo "   macOS: brew services start mysql"
echo "   Linux: sudo systemctl start mysql"
echo ""
echo "2. Start Backend (Terminal 1):"
echo "   cd implementation/backend"
echo "   mvn spring-boot:run"
echo ""
echo "3. Start Frontend (Terminal 2):"
echo "   cd implementation/frontend"
echo "   npm start"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:3005"
echo "   Backend API: http://localhost:8081/api"
echo "   Swagger UI: http://localhost:8081/api/swagger-ui/index.html"
echo ""
echo "5. Default login credentials:"
echo "   Username: admin"
echo "   Password: Admin123!"
echo ""
print_status "Setup completed! Happy coding! 🚀"
