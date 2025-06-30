# DigiteX Ecommerce Frontend

A modern, responsive React frontend for DigiteX laptop store with comprehensive ecommerce functionality, admin dashboard, and seamless user experience built with Vite and Tailwind CSS.

## Features

- **Modern React Architecture**
  - React 19.1.0 with Vite for fast development
  - Redux Toolkit for state management
  - React Router for navigation
  - Component-based architecture

- **User Experience**
  - Responsive design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Interactive UI components
  - Mobile-first approach

- **Authentication & Authorization**
  - JWT token management
  - Protected routes
  - Role-based access (Admin/User)
  - Google login integration

- **Shopping Features**
  - Product catalog and search
  - Shopping cart functionality
  - Wishlist management
  - Order tracking
  - Stripe payment integration

- **Admin Dashboard**
  - Product management
  - Category management
  - Order management
  - User management
  - Contact form management
  - Analytics and reporting

- **Enhanced Functionality**
  - Form validation with Formik & Yup
  - Toast notifications
  - Phone number input
  - Data visualization with Recharts
  - Image carousels with React Slick

## Tech Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: Formik + Yup
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons
- **Notifications**: React Toastify
- **Charts**: Recharts
- **Payments**: Stripe React Components

## Project Structure

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── assets/
│   │   ├── home/          
│   │   ├── logo.png
│   │   └── react.svg
│   ├── components/         
│   │   ├── admin/          
│   │   ├── auth/           
│   │   ├── common/        
│   │   ├── modals/         
│   │   ├── popups/         
│   │   ├── products/      
│   │   └── user/           
│   ├── hooks/             
│   │   ├── useAddons.js
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useCategory.js
│   │   ├── useContact.js
│   │   ├── useOrders.js
│   │   ├── usePayment.js
│   │   ├── useProducts.js
│   │   ├── useTheme.js
│   │   ├── useUser.js
│   │   └── useWishlist.js
│   ├── layouts/           
│   │   ├── AdminLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── MainLayout.jsx
│   │   └── UserLayout.jsx
│   ├── lib/               
│   │   ├── api/          
│   │   │   ├── addon.js
│   │   │   ├── auth.js
│   │   │   ├── cart.js
│   │   │   ├── category.js
│   │   │   ├── client.js
│   │   │   ├── contact.js
│   │   │   ├── order.js
│   │   │   ├── payment.js
│   │   │   ├── product.js
│   │   │   ├── user.js
│   │   │   └── wishlist.js
│   ├── pages/             
│   │   ├── admin/          
│   │   │   ├── addons/
│   │   │   ├── analysis/
│   │   │   ├── categories/
│   │   │   ├── contact/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── profile/
│   │   │   ├── users/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── auth/          
│   │   ├── public/        
│   │   │   ├── categories/
│   │   │   ├── payment/
│   │   │   ├── products/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── NotFoundPage.jsx
│   │   └── user/          
│   │       ├── orders/
│   │       ├── profile/
│   │       ├── stats/
│   │       ├── UserDashboard.jsx
│   │       └── Wishlist.jsx
│   ├── redux/             
│   │   ├── slices/        
│   │   │   ├── addonSlice.js
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── categorySlice.js
│   │   │   ├── contactSlice.js
│   │   │   ├── orderSlice.js
│   │   │   ├── paymentSlice.js
│   │   │   ├── productSlice.js
│   │   │   ├── themeSlice.js
│   │   │   ├── userSlice.js
│   │   │   └── wishlistSlice.js
│   │   └── store.js        
│   ├── routes/            
│   │   ├── AdminRoutes.jsx
│   │   ├── PublicRoutes.jsx
│   │   └── UserRoutes.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rami2212/DigiteX_Ecommerce_Store.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   Contact me for the .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Architecture Pattern

### Component Structure
The frontend follows a **feature-based architecture** with clear separation:

- **Pages** - Route-level components
- **Components** - Reusable UI components organized by feature
- **Hooks** - Custom hooks for business logic
- **Redux Slices** - State management by feature
- **API Layer** - Centralized API calls
- **Layouts** - Page layout templates

### State Management Flow
```
Component → Custom Hook → Redux Action → API Call → Redux State Update → Component Re-render
```

### Route Structure
- **Public Routes** - Accessible to all users
- **User Routes** - Protected routes for authenticated users
- **Admin Routes** - Protected routes for admin users

## Key Features

### User Dashboard
- Personal profile management
- Order history and tracking
- Wishlist management
- Account statistics

### Admin Dashboard
- Comprehensive analytics
- Product and category management
- Order management
- User management
- Contact form management

### Shopping Experience
- Advanced product filtering
- Real-time cart updates
- Secure checkout with Stripe
- Wishlist functionality
- Responsive design

## Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support
- **Consistent design system** across components
- **Smooth animations** with Framer Motion

## Security Features

- JWT token-based authentication
- Protected routes with role-based access
- Input validation and sanitization
- Secure API communication
- XSS protection

## Key Dependencies

### Core
- **React**: ^19.1.0 - UI library
- **Vite**: ^6.3.5 - Build tool
- **React Router DOM**: ^7.6.0 - Routing

### State Management
- **Redux Toolkit**: ^2.8.2 - State management
- **React Redux**: ^9.2.0 - React-Redux bindings

### UI & Styling
- **Tailwind CSS**: ^3.4.17 - Utility-first CSS
- **Framer Motion**: ^12.12.1 - Animations
- **Lucide React**: ^0.511.0 - Icons

### Forms & Validation
- **Formik**: ^2.4.6 - Form library
- **Yup**: ^1.6.1 - Schema validation

### Payment & Charts
- **Stripe**: ^7.3.1 - Payment processing
- **Recharts**: ^2.15.3 - Data visualization

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run start        # Alias for dev

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## API Integration

The frontend communicates with the backend through a centralized API layer:

- **Base URL**: Configured via environment variables
- **Authentication**: JWT tokens in headers
- **Error Handling**: Centralized error management
- **Request/Response**: Axios interceptors for common logic

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Tailwind CSS responsive breakpoints
- **Touch Friendly**: Optimized for touch interfaces
- **Performance**: Optimized images and lazy loading

## Development Tools

- **ESLint**: Code linting and formatting
- **Vite**: Fast development and build tool
- **PostCSS**: CSS processing
- **Autoprefixer**: Vendor prefix automation

## Deployment

The application can be deployed to various platforms:

```bash
# Build the application
npm run build

# The dist/ folder contains the production build
```

## Support

For support, email ramithapathmilarp@gmail.com

---

**DigiteX** - Modern laptop store.