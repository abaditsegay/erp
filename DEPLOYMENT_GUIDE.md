# ERP System Local Deployment Guide

This guide provides comprehensive instructions for deploying the Ethiopian Business ERP system locally using Docker containers.

## 📋 Prerequisites

### Required Software
- **Docker Desktop** (latest version)
- **Docker Compose** (v2.0+ recommended)
- **Git** (for version control)
- **8GB+ RAM** (recommended for smooth operation)
- **10GB+ free disk space**

### System Requirements
- **macOS**: 10.15+ (Catalina or later)
- **Windows**: Windows 10 Pro/Enterprise with WSL2
- **Linux**: Any modern distribution with Docker support

## 🚀 Quick Start

### 1. Check System Readiness
```bash
./deploy.sh check
```

### 2. Deploy Development Environment (Database Only)
```bash
./deploy.sh dev
```

### 3. Deploy Full Production Environment
```bash
./deploy.sh prod
```

## 📖 Detailed Deployment Options

### Option 1: Development Environment
**Use Case**: Local development with hot-reloading

```bash
# Start database and tools only
./deploy.sh dev

# Then run applications locally:
# Backend: cd implementation/backend && mvn spring-boot:run
# Frontend: cd implementation/frontend && npm start
```

**Services Provided**:
- MySQL Database (port 3306)
- Redis Cache (port 6379)
- phpMyAdmin (http://localhost:8082)

### Option 2: Production Environment
**Use Case**: Full containerized deployment

```bash
# Build and deploy everything
./deploy.sh prod
```

**Services Provided**:
- Frontend (http://localhost:80)
- Backend API (http://localhost:8081)
- MySQL Database (port 3306)
- Redis Cache (port 6379)

### Option 3: Production with Load Balancer
**Use Case**: High-availability setup with load balancing

```bash
# Deploy with nginx load balancer
./deploy.sh prod-lb
```

**Additional Services**:
- Load Balancer (http://localhost:8080)
- Rate limiting and security features

## 🔧 Management Commands

### Service Control
```bash
# Stop all services
./deploy.sh stop

# Restart production environment
./deploy.sh restart

# Check service status
./deploy.sh status
```

### Monitoring & Debugging
```bash
# View all logs
./deploy.sh logs

# View specific service logs
./deploy.sh logs backend
./deploy.sh logs frontend
./deploy.sh logs database

# Follow logs in real-time
./deploy.sh logs backend -f
```

### Maintenance
```bash
# Clean up containers and images
./deploy.sh clean

# Rebuild application
./deploy.sh build
```

## 🌐 Access Points

### Main Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081
- **Load Balancer**: http://localhost:8080 (if using prod-lb)

### Development Tools
- **phpMyAdmin**: http://localhost:8082
  - Username: `root`
  - Password: `rootpassword`
- **API Documentation**: http://localhost:8081/swagger-ui/index.html
- **Health Check**: http://localhost:8081/actuator/health

### Database Access
- **Host**: localhost
- **Port**: 3306
- **Database**: erp_system
- **Username**: erp_user
- **Password**: erp_password

## 👤 Default Login Credentials

```
Username: admin
Password: password123
```

## 🗂️ File Structure

```
ERP-Project/
├── docker-compose.yml          # Production deployment
├── docker-compose.dev.yml      # Development deployment
├── nginx-lb.conf              # Load balancer configuration
├── deploy.sh                  # Deployment script
├── implementation/
│   ├── backend/
│   │   └── Dockerfile         # Backend container definition
│   ├── frontend/
│   │   ├── Dockerfile         # Frontend container definition
│   │   └── nginx.conf         # Frontend nginx configuration
│   └── database/
│       ├── mysql_schema.sql   # Database schema
│       └── 02_stored_procedures.sql
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using port 80
lsof -i :80

# Check what's using port 3306
lsof -i :3306

# Kill process using port (replace PID)
kill -9 <PID>
```

#### 2. Docker Issues
```bash
# Restart Docker Desktop
# On macOS: Docker Desktop -> Restart

# Clear Docker cache
docker system prune -a

# Reset Docker to factory settings (last resort)
```

#### 3. Database Connection Issues
```bash
# Check database logs
./deploy.sh logs database

# Restart just the database
docker-compose restart database

# Connect to database directly
docker exec -it erp-database mysql -u erp_user -p
```

#### 4. Application Not Loading
```bash
# Check all service status
./deploy.sh status

# Check specific service health
docker-compose ps

# View application logs
./deploy.sh logs frontend
./deploy.sh logs backend
```

### Service Health Checks
All services include health checks that can be monitored:

```bash
# Check container health
docker ps --filter "name=erp"

# View health check logs
docker inspect erp-backend | grep -A 10 Health
```

## 🔒 Security Considerations

### Production Deployment
- Change default passwords in docker-compose.yml
- Use environment files for sensitive data
- Enable SSL/TLS certificates
- Configure firewall rules
- Regular security updates

### Environment Variables
Create `.env` file for sensitive configuration:
```bash
# Database
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password

# JWT
APP_JWT_SECRET=your_jwt_secret_key

# API Keys
API_KEY=your_api_key
```

## 📊 Performance Optimization

### Resource Allocation
```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2G
    reservations:
      cpus: '1.0'
      memory: 1G
```

### Database Optimization
```sql
-- MySQL performance tuning (connect to database)
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL query_cache_size = 67108864; -- 64MB
```

## 🚀 Production Deployment

### Environment Configuration
1. Copy `docker-compose.yml` to production server
2. Update environment variables
3. Configure SSL certificates
4. Set up monitoring and logging
5. Configure automated backups

### Monitoring Setup
```bash
# Add monitoring services to docker-compose.yml
# - Prometheus for metrics
# - Grafana for dashboards
# - ELK stack for logs
```

## 📞 Support

### Log Files
- Application logs: `./deploy.sh logs`
- Docker logs: `docker logs <container-name>`
- System logs: Check Docker Desktop logs

### Debug Mode
```bash
# Enable debug logging
export LOGGING_LEVEL_COM_ERP=DEBUG
./deploy.sh restart
```

### Performance Monitoring
```bash
# Monitor resource usage
docker stats

# Monitor specific container
docker stats erp-backend
```

This deployment setup provides a robust, scalable foundation for the Ethiopian Business ERP system with comprehensive monitoring, security, and maintenance capabilities.
