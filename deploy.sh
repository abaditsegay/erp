#!/bin/bash

# ERP System Local Deployment Script
# This script helps deploy the ERP system locally using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
check_docker() {
    log_info "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    log_success "Docker is installed and running"
}

# Check if Docker Compose is available
check_docker_compose() {
    log_info "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    log_success "Docker Compose is available"
}

# Function to use docker compose (try v2 first, fallback to v1)
docker_compose_cmd() {
    if docker compose version &> /dev/null; then
        docker compose "$@"
    else
        docker-compose "$@"
    fi
}

# Clean up existing containers and images
cleanup() {
    log_info "Cleaning up existing containers and images..."
    
    # Stop and remove containers
    docker_compose_cmd -f docker-compose.yml down --remove-orphans 2>/dev/null || true
    docker_compose_cmd -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true
    
    # Remove ERP-related images
    docker images | grep -E "(erp|frontend|backend)" | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Build the application
build_application() {
    log_info "Building ERP application..."
    
    # Build backend
    log_info "Building Spring Boot backend..."
    cd implementation/backend
    if [ -f "mvnw" ]; then
        ./mvnw clean package -DskipTests
    else
        mvn clean package -DskipTests
    fi
    cd ../..
    
    # Build frontend
    log_info "Building React frontend..."
    cd implementation/frontend
    npm ci
    npm run build
    cd ../..
    
    log_success "Application built successfully"
}

# Deploy development environment (database only)
deploy_dev() {
    log_info "Deploying development environment..."
    docker_compose_cmd -f docker-compose.dev.yml up -d
    
    log_info "Waiting for database to be ready..."
    sleep 30
    
    log_success "Development environment deployed"
    log_info "Services available:"
    log_info "  - MySQL Database: localhost:3306"
    log_info "  - Redis Cache: localhost:6379"
    log_info "  - phpMyAdmin: http://localhost:8082"
    log_info "    Username: root, Password: rootpassword"
}

# Deploy production environment
deploy_prod() {
    log_info "Deploying production environment..."
    docker_compose_cmd -f docker-compose.yml up -d --build
    
    log_info "Waiting for services to be ready..."
    sleep 60
    
    # Check service health
    check_services_health
    
    log_success "Production environment deployed"
    show_service_urls
}

# Deploy with load balancer
deploy_with_lb() {
    log_info "Deploying with load balancer..."
    docker_compose_cmd -f docker-compose.yml --profile loadbalancer up -d --build
    
    log_info "Waiting for services to be ready..."
    sleep 60
    
    check_services_health
    
    log_success "Production environment with load balancer deployed"
    show_service_urls
    log_info "  - Load Balancer: http://localhost:8080"
}

# Check service health
check_services_health() {
    log_info "Checking service health..."
    
    services=("database" "backend" "frontend")
    for service in "${services[@]}"; do
        if docker_compose_cmd -f docker-compose.yml ps | grep -q "$service.*healthy"; then
            log_success "$service is healthy"
        else
            log_warning "$service might not be fully ready yet"
        fi
    done
}

# Show service URLs
show_service_urls() {
    log_info "ERP System is running at:"
    log_info "  - Frontend: http://localhost"
    log_info "  - Backend API: http://localhost:8081"
    log_info "  - Database: localhost:3306"
    log_info "  - Redis: localhost:6379"
    log_info ""
    log_info "Login credentials:"
    log_info "  - Username: admin"
    log_info "  - Password: password123"
}

# Stop all services
stop_services() {
    log_info "Stopping all services..."
    docker_compose_cmd -f docker-compose.yml down
    docker_compose_cmd -f docker-compose.dev.yml down
    log_success "All services stopped"
}

# Show logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker_compose_cmd -f docker-compose.yml logs -f
    else
        docker_compose_cmd -f docker-compose.yml logs -f "$service"
    fi
}

# Main script logic
main() {
    echo "==============================================="
    echo "       ERP System Local Deployment"
    echo "==============================================="
    echo ""
    
    case "$1" in
        "check")
            check_docker
            check_docker_compose
            log_success "System ready for deployment"
            ;;
        "build")
            check_docker
            check_docker_compose
            build_application
            ;;
        "dev")
            check_docker
            check_docker_compose
            deploy_dev
            ;;
        "prod")
            check_docker
            check_docker_compose
            build_application
            deploy_prod
            ;;
        "prod-lb")
            check_docker
            check_docker_compose
            build_application
            deploy_with_lb
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            sleep 5
            deploy_prod
            ;;
        "clean")
            cleanup
            ;;
        "logs")
            show_logs "$2"
            ;;
        "status")
            docker_compose_cmd -f docker-compose.yml ps
            ;;
        *)
            echo "Usage: $0 {check|build|dev|prod|prod-lb|stop|restart|clean|logs|status}"
            echo ""
            echo "Commands:"
            echo "  check     - Check if Docker is ready"
            echo "  build     - Build the application"
            echo "  dev       - Deploy development environment (database + tools)"
            echo "  prod      - Deploy full production environment"
            echo "  prod-lb   - Deploy with load balancer"
            echo "  stop      - Stop all services"
            echo "  restart   - Restart production environment"
            echo "  clean     - Clean up containers and images"
            echo "  logs      - Show logs (optionally specify service name)"
            echo "  status    - Show container status"
            echo ""
            echo "Examples:"
            echo "  $0 check"
            echo "  $0 prod"
            echo "  $0 logs backend"
            echo "  $0 stop"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
