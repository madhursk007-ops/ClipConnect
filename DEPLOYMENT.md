# 🚀 ClipConnect - Production Deployment Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Variables](#environment-variables)
- [Stripe Configuration](#stripe-configuration)
- [Cloudinary Setup](#cloudinary-setup)
- [SSL & Security](#ssl--security)
- [Monitoring & Logging](#monitoring--logging)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

ClipConnect is a full-stack AI-powered video editor marketplace with premium features including:
- AI-powered editor matching
- Subscription-based monetization
- Real-time chat and notifications
- Advanced analytics dashboard
- Referral and growth systems
- Secure payment processing

This guide covers production deployment for both frontend and backend services.

---

## 🛠️ Prerequisites

### Required Services
- **Node.js** (v18+)
- **MongoDB** (v5.0+)
- **Redis** (for caching and sessions)
- **Stripe** (for payments)
- **Cloudinary** (for file storage)
- **Email Service** (SendGrid/SES)
- **Domain & SSL Certificate**

### Development Tools
- **Git** for version control
- **Docker** (optional, for containerization)
- **PM2** for process management
- **Nginx** for reverse proxy

---

## 🌍 Environment Setup

### 1. Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Redis
sudo apt install redis-server -y

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start services
sudo systemctl start mongodb
sudo systemctl start redis
sudo systemctl start nginx
sudo systemctl enable mongodb redis nginx
```

### 2. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/clipconnect.git
cd clipconnect

# Create production directories
mkdir -p /var/www/clipconnect
mkdir -p /var/log/clipconnect
```

---

## 🗄️ Database Setup

### MongoDB Configuration

```bash
# Create MongoDB user
mongo
> use clipconnect
> db.createUser({
    user: "clipconnect",
    pwd: "your-secure-password",
    roles: ["readWrite"]
  })
> exit

# Configure MongoDB for production
sudo nano /etc/mongod.conf
```

Add to `mongod.conf`:
```yaml
security:
  authorization: enabled
net:
  bindIp: 127.0.0.1
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
```

```bash
# Restart MongoDB
sudo systemctl restart mongod
```

### Redis Configuration

```bash
# Configure Redis
sudo nano /etc/redis/redis.conf
```

Update settings:
```conf
bind 127.0.0.1
port 6379
requirepass your-redis-password
maxmemory 256mb
maxmemory-policy allkeys-lru
```

```bash
# Restart Redis
sudo systemctl restart redis
```

---

## 🔧 Backend Deployment

### 1. Install Dependencies

```bash
cd /var/www/clipconnect/backend
npm ci --production
```

### 2. Environment Variables

Create `.env` file:
```bash
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://clipconnect:your-secure-password@localhost:27017/clipconnect

# Redis
REDIS_URL=redis://:your-redis-password@localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-256-chars-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-256-chars-long
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRO_PRICE_ID=price_1pro
STRIPE_PREMIUM_PRICE_ID=price_1premium

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 3. PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'clipconnect-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/clipconnect/error.log',
    out_file: '/var/log/clipconnect/out.log',
    log_file: '/var/log/clipconnect/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
```

### 4. Start Backend

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

---

## 🎨 Frontend Deployment

### 1. Build Production Bundle

```bash
cd /var/www/clipconnect/frontend-react
npm ci
npm run build
```

### 2. Environment Variables

Create `.env.production`:
```bash
VITE_API_URL=https://api.your-domain.com
VITE_SOCKET_URL=https://api.your-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
```

### 3. Configure Nginx

Create `/etc/nginx/sites-available/clipconnect`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend
    location / {
        root /var/www/clipconnect/frontend-react/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/clipconnect /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔐 SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup auto-renewal
sudo crontab -e
```

Add to crontab:
```cron
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 💳 Stripe Configuration

### 1. Create Stripe Products

```bash
# Using Stripe CLI or Dashboard
stripe products create name="Pro Plan" --description="Monthly Pro subscription"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=2900 --recurring=interval=month
stripe prices create --product=prod_xxx --currency=usd --unit-amount=9900 --recurring=interval=month
```

### 2. Configure Webhooks

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://api.your-domain.com/subscription/webhook`
3. Select events: `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
4. Copy webhook secret to environment variables

---

## ☁️ Cloudinary Setup

1. Sign up for Cloudinary account
2. Create upload preset with transformations
3. Update environment variables with credentials
4. Configure folder structure for uploads

---

## 📊 Monitoring & Logging

### 1. PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart on failure
pm2 restart clipconnect-api
```

### 2. Log Rotation

Create `/etc/logrotate.d/clipconnect`:
```
/var/log/clipconnect/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Health Checks

```bash
# Add to crontab for health monitoring
*/5 * * * * curl -f https://api.your-domain.com/api/health || pm2 restart clipconnect-api
```

---

## ⚡ Performance Optimization

### 1. Database Indexing

Create indexes in MongoDB:
```javascript
// User indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })

// Project indexes
db.projects.createIndex({ "client": 1 })
db.projects.createIndex({ "status": 1 })
db.projects.createIndex({ "skills": 1 })
db.projects.createIndex({ "budget": 1 })
db.projects.createIndex({ "createdAt": -1 })

// Message indexes
db.messages.createIndex({ "participants": 1 })
db.messages.createIndex({ "createdAt": -1 })
```

### 2. Redis Caching

```javascript
// Implement caching for frequently accessed data
// Example: Cache user sessions, popular projects, etc.
```

### 3. CDN Configuration

Configure Cloudinary CDN for assets:
```javascript
// In frontend build
const CDN_URL = 'https://res.cloudinary.com/your-cloud/video/upload/'
```

---

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Check logs
   sudo tail -f /var/log/mongodb/mongod.log
   ```

2. **Nginx 502 Bad Gateway**
   ```bash
   # Check if backend is running
   pm2 status
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Stripe Webhook Issues**
   ```bash
   # Test webhook endpoint
   curl -X POST https://api.your-domain.com/subscription/webhook
   ```

4. **Memory Issues**
   ```bash
   # Check memory usage
   pm2 monit
   
   # Increase memory limit
   pm2 restart clipconnect-api --max-memory-restart 1G
   ```

### Performance Monitoring

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit

# Monitor system resources
htop
iostat -x 1
```

---

## 🚀 Deployment Commands

### Quick Deploy

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying ClipConnect..."

# Pull latest changes
git pull origin main

# Install dependencies
cd backend && npm ci --production
cd ../frontend-react && npm ci

# Build frontend
npm run build

# Restart backend
pm2 restart clipconnect-api

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Deployment complete!"
```

### Rollback

```bash
#!/bin/bash
# rollback.sh

echo "🔄 Rolling back..."

# Checkout previous commit
git checkout HEAD~1

# Rebuild and restart
./deploy.sh

echo "✅ Rollback complete!"
```

---

## 📱 Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test API endpoints
- [ ] Check database connections
- [ ] Test Stripe payments
- [ ] Verify email sending
- [ ] Test file uploads
- [ ] Check SSL certificate
- [ ] Monitor error logs
- [ ] Test mobile responsiveness
- [ ] Verify real-time features

---

## 🎉 Success Metrics

Monitor these metrics post-deployment:
- **Uptime**: Target 99.9%
- **Response Time**: < 200ms for API calls
- **Error Rate**: < 1%
- **Page Load**: < 3 seconds
- **Conversion Rate**: Track signups and upgrades

---

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs` and `/var/log/nginx/error.log`
2. Verify environment variables
3. Test database connectivity
4. Check Stripe webhook configuration
5. Monitor system resources

---

**🎯 You're now ready to deploy ClipConnect to production!**

This guide provides a comprehensive setup for a scalable, secure, and performant deployment of your video editor marketplace.
