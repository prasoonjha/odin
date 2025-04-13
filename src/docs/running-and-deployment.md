# Running and Deployment Guide

This document provides detailed instructions for running the Library Management API and deploying it to different environments.

## Running the Application Locally

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Set up Environment Variables

Create a `.env` file in the root directory:

```
# Port number
PORT=3000

# URL of the Mongo DB (use your own MongoDB connection string)
MONGODB_URL=mongodb://127.0.0.1:27017/library-management

# JWT secret key (change this to a secure random string)
JWT_SECRET=your-secret-key

# JWT access token expiration
JWT_ACCESS_EXPIRATION_MINUTES=30

# JWT refresh token expiration
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP configuration for email service
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-username
SMTP_PASSWORD=email-password
EMAIL_FROM=your-email@example.com

# Set to development to see documentation
NODE_ENV=development
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Step 3: Start the Application

**Development Mode (with hot-reload):**
```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

**Production Mode:**
```bash
# Using npm
npm start

# Using yarn
yarn start
```

The application will start on the port specified in your `.env` file (default: 3000).

### Step 4: Verify the Application is Running

1. Open your browser and go to: `http://localhost:3000/v1/docs`
2. If the Swagger UI doesn't load, try: `http://localhost:3000/v1/docs/static`

## Deployment Options

### Option 1: Docker Deployment

#### Prerequisites
- Docker installed on your machine

#### Step 1: Build the Docker Image
```bash
docker build -t library-api .
```

#### Step 2: Run the Docker Container
```bash
docker run -p 3000:3000 \
  -e MONGODB_URL=mongodb://host.docker.internal:27017/library-management \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  library-api
```

For connecting to a MongoDB container:
```bash
# Create a Docker network
docker network create library-network

# Run MongoDB container
docker run -d --name mongodb --network library-network -p 27017:27017 mongo

# Run API container
docker run -p 3000:3000 \
  -e MONGODB_URL=mongodb://mongodb:27017/library-management \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  --network library-network \
  library-api
```

### Option 2: Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Step 1: Login to Heroku
```bash
heroku login
```

#### Step 2: Create a New Heroku App
```bash
heroku create your-app-name
```

#### Step 3: Add MongoDB Add-on
```bash
heroku addons:create mongodb:sandbox
```

#### Step 4: Configure Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secure-random-string
heroku config:set JWT_ACCESS_EXPIRATION_MINUTES=30
heroku config:set JWT_REFRESH_EXPIRATION_DAYS=30
```

#### Step 5: Deploy to Heroku
```bash
git push heroku main
```

#### Step 6: Open the App
```bash
heroku open
```

### Option 3: AWS EC2 Deployment

#### Step 1: Set up an EC2 Instance
1. Launch an Amazon EC2 instance (Ubuntu recommended)
2. Connect to the instance using SSH

#### Step 2: Install Node.js and MongoDB
```bash
# Update package lists
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 3: Clone and Set Up the Application
```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install

# Create the .env file
cat > .env << EOL
PORT=3000
MONGODB_URL=mongodb://localhost:27017/library-management
JWT_SECRET=$(openssl rand -base64 32)
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
NODE_ENV=production
EOL
```

#### Step 4: Use PM2 for Process Management
```bash
# Install PM2
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "library-api" -- start

# Ensure PM2 starts on system reboot
pm2 startup
pm2 save
```

#### Step 5: Set Up Nginx as a Reverse Proxy (Optional)
```bash
# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/library-api

# Add the following configuration
# server {
#     listen 80;
#     server_name your-domain.com www.your-domain.com;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# Enable the site and restart Nginx
sudo ln -s /etc/nginx/sites-available/library-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 4: Azure App Service Deployment

#### Step 1: Install the Azure CLI and login
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
```

#### Step 2: Create a resource group
```bash
az group create --name LibraryApiGroup --location eastus
```

#### Step 3: Create an App Service plan
```bash
az appservice plan create --name LibraryApiPlan --resource-group LibraryApiGroup --sku B1 --is-linux
```

#### Step 4: Create a web app
```bash
az webapp create --resource-group LibraryApiGroup --plan LibraryApiPlan --name your-app-name --runtime "NODE|16-lts"
```

#### Step 5: Configure environment variables
```bash
az webapp config appsettings set --resource-group LibraryApiGroup --name your-app-name --settings NODE_ENV=production MONGODB_URL="your-mongodb-connection-string" JWT_SECRET="your-secret-key"
```

#### Step 6: Deploy your application
```bash
# Install the ZIP deployment extension
az extension add --name webapp

# Create a ZIP of your application
zip -r app.zip .

# Deploy the ZIP
az webapp deployment source config-zip --resource-group LibraryApiGroup --name your-app-name --src app.zip
```

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in .env file
- Ensure network permissions allow access to MongoDB port (27017)

### API Not Starting
- Check logs: `npm run logs` or `pm2 logs`
- Verify all required environment variables are set
- Ensure Node.js version is compatible (v14+)

### Documentation Not Showing
- Make sure NODE_ENV is set to 'development'
- Try accessing the static documentation at `/v1/docs/static`
- Check server logs for any Swagger-related errors

### Deployment Issues
- Docker: Make sure MongoDB connection string uses correct network settings
- Heroku: Check logs with `heroku logs --tail`
- AWS/Azure: Check application logs and ensure proper network configuration

## Database Management

### Backup MongoDB Data
```bash
# Backup
mongodump --db library-management --out /path/to/backup/folder

# Restore
mongorestore --db library-management /path/to/backup/folder/library-management
```

### Seeding Initial Data (Optional)
The application will automatically seed dummy data for demonstration purposes when models are first loaded. 