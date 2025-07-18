# DigiteX Ecommerce Store

A full-stack ecommerce application for laptop sales featuring a Node.js backend API and React frontend with comprehensive admin dashboard, user management, and Stripe payment integration.

🌐 **Live Demo**: [https://digitex-app.azurewebsites.net/](https://digitex-app.azurewebsites.net/)

## Documentation

[Backend Documentation](./backend/README.md) - Complete backend API documentation<br>
[Frontend Documentation](./frontend/README.md) - Frontend architecture and component guide

## Features

### Backend (Node.js + Express)
- **User Authentication & Authorization**
  - JWT-based authentication with social login (Google & Facebook OAuth)
  - Role-based access control (Admin/User)
  - Password encryption with bcryptjs

- **Product & Inventory Management**
  - Product catalog with categories and addons
  - Stock management and tracking
  - Image upload functionality with Multer

- **Shopping & Orders**
  - Shopping cart operations
  - Order processing and management
  - Wishlist functionality

- **Payment Processing**
  - Stripe payment integration
  - Secure payment handling
  - Order confirmation system

- **Communication**
  - Contact form handling
  - Email notifications with Nodemailer

### Frontend (React + Vite)
- **Modern React Architecture**
  - React 19.1.0 with Vite for fast development
  - Redux Toolkit for state management
  - Component-based architecture with custom hooks

- **User Experience**
  - Responsive design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Mobile-first approach

- **Admin Dashboard**
  - Product and category management
  - Order and user management
  - Analytics and reporting with Recharts

- **Shopping Features**
  - Product catalog with advanced filtering
  - Real-time cart updates
  - Secure checkout process
  - Wishlist management

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with JWT
- **Payment**: Stripe
- **File Upload**: Multer
- **Validation**: Joi
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: Formik + Yup
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Charts**: Recharts

### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Azure Container Registry + Azure Web Apps

## Project Structure

```
DigiteX_Ecommerce_Store/
├── backend/                    # Node.js Backend
│   ├── config/                # Database and authentication config
│   ├── controllers/           # Route controllers
│   ├── dtos/                  # Data Transfer Objects
│   ├── middleware/            # Custom middleware
│   ├── models/                # MongoDB models
│   ├── repositories/          # Data access layer
│   ├── routes/                # API routes
│   ├── services/              # Business logic services
│   ├── uploads/               # File upload directory
│   ├── utils/                 # Utility functions
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Main server file
├── frontend/                   # React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Layout components
│   │   ├── lib/               # API configurations
│   │   ├── pages/             # Page components
│   │   ├── redux/             # Redux store and slices
│   │   ├── routes/            # Route configurations
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose configuration
├── nginx.conf                 # Nginx configuration
├── start.sh                   # Container startup script
└── README.md                  # This file
```

## 🔧 Quick Start

### Prerequisites
- Node.js 20+ and npm
- MongoDB
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rami2212/DigiteX_Ecommerce_Store.git
   cd DigiteX_Ecommerce_Store
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file (contact for environment variables)
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file (contact for environment variables)
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application at http://localhost:8080
```

## Architecture

### Backend Architecture
Follows a **layered architecture pattern** with clear separation of concerns:

```
HTTP Request → Routes → Controller → Service → Repository → Database
                ↓
HTTP Response ← Controller ← Service ← Repository ← Database
```

Each feature module includes:
- **Routes** - API endpoint definitions
- **Controllers** - HTTP request/response handling
- **Services** - Business logic implementation
- **Repositories** - Data access layer
- **Models** - MongoDB schema definitions
- **DTOs** - Data validation objects

### Frontend Architecture
**Feature-based architecture** with:
- **Pages** - Route-level components
- **Components** - Reusable UI components by feature
- **Hooks** - Custom hooks for business logic
- **Redux Slices** - State management by feature
- **API Layer** - Centralized HTTP requests

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth

### Core Endpoints
- **Products**: `/api/products` - CRUD operations
- **Categories**: `/api/categories` - Category management
- **Cart**: `/api/cart` - Shopping cart operations
- **Orders**: `/api/orders` - Order processing
- **Payments**: `/api/payments` - Stripe integration
- **Users**: `/api/users` - User management
- **Wishlist**: `/api/wishlist` - Wishlist operations

## Deployment

### Docker Deployment

The application uses a **multi-stage Docker build** that creates optimized images for both frontend and backend:

```dockerfile
# Multi-stage build process:
# 1. Build backend dependencies
# 2. Build frontend for production
# 3. Combine with Nginx for serving
```

**Key Features:**
- Alpine Linux base for minimal size
- Multi-stage builds for optimization
- Nginx for serving static files and API proxying
- Single container running both services

### Local Docker Deployment

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment on Azure

#### GitHub Actions Workflow

The project includes automated CI/CD with GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
# Workflow triggers on push to master branch
# 1. Builds Docker image
# 2. Pushes to Azure Container Registry
# 3. Deploys to Azure Web App
```

#### Manual Azure Deployment

```bash
# Build for Azure
docker build -t digitex-app:latest .

# Tag for Azure Container Registry
docker tag digitex-app:latest <your-acr>.azurecr.io/digitex-app:latest

# Push to ACR
docker push <your-acr>.azurecr.io/digitex-app:latest
```

#### Azure Resources Required

1. **Azure Container Registry** - Store Docker images
2. **Azure Web App** - Host the containerized application
3. **GitHub Secrets** for automated deployment:
   - `ACR_LOGIN_SERVER`
   - `ACR_USERNAME`
   - `ACR_PASSWORD`
   - `AZURE_WEBAPP_PUBLISH_PROFILE`


## Development Scripts

### Backend
```bash
npm start          # Production server
npm run dev        # Development server
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Code linting
```

### Docker
```bash
docker-compose up --build    # Build and run
docker-compose logs -f       # View logs
docker-compose down         # Stop services
```

## Security Features

- **Authentication**: JWT tokens with secure headers
- **Authorization**: Role-based access control
- **Data Validation**: Input sanitization with Joi/Yup
- **Password Security**: bcryptjs hashing
- **CORS Protection**: Configured for frontend domain
- **File Upload Security**: Type and size restrictions
- **Environment Variables**: Sensitive data protection

## Performance Features

- **Frontend**: Vite for fast builds, lazy loading, code splitting
- **Backend**: Efficient MongoDB queries, caching strategies
- **Docker**: Multi-stage builds for smaller images
- **Nginx**: Static file serving, gzip compression, caching headers

## Support

- **Email**: ramithapathmilarp@gmail.com
- **Live Demo**: [https://digitex-app.azurewebsites.net/](https://digitex-app.azurewebsites.net/)

---

**DigiteX** - Modern laptop store with exceptional full-stack architecture and seamless deployment pipeline.