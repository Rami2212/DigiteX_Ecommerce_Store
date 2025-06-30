# DigiteX Ecommerce Backend

A comprehensive Node.js backend API for DigiteX laptop store with full ecommerce functionality including user management, product catalog, cart operations, order processing, and Stripe payment integration.

🌐 **Live Demo**: [https://digitex-app.azurewebsites.net/](https://digitex-app.azurewebsites.net/)

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Social login (Google & Facebook OAuth)
  - Password encryption with bcryptjs
  - Session management

- **Product Management**
  - Product catalog with categories
  - Stock management
  - Product addons support
  - Image upload functionality

- **Shopping Experience**
  - Shopping cart operations
  - Wishlist functionality
  - Order management
  - Checkout process

- **Payment Processing**
  - Stripe payment integration
  - Secure payment handling
  - Order confirmation system

- **Communication**
  - Contact form handling
  - Email notifications with Nodemailer

## Architecture Pattern

This backend follows a **layered architecture pattern** with clear separation of concerns:

### Layer Structure
Each feature module (auth, cart, category, etc.) follows the same architectural pattern:

- **Routes** (`*.routes.js`) - API endpoint definitions and routing
- **Controllers** (`*.controller.js`) - HTTP request/response handling
- **Services** (`*.service.js`) - Business logic implementation
- **Repositories** (`*.repository.js`) - Data access layer
- **Models** (`*.model.js`) - MongoDB schema definitions
- **DTOs** (`*.dto.js`) - Data Transfer Objects for validation

### Data Flow
```
HTTP Request → Routes → Controller → Service → Repository → Database
                ↓
HTTP Response ← Controller ← Service ← Repository ← Database
```

This architecture ensures:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Maintainability**: Easy to modify individual components
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features following the same pattern

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with JWT
- **Payment**: Stripe
- **File Upload**: Multer
- **Validation**: Joi
- **Email**: Nodemailer

## Project Structure

```
backend/
├── assets/
│   └── uploads/          
├── config/
│   ├── db.js      
│   ├── passport.js            
│   └── stripe.js     
├── controllers/         
│   ├── addon.controller.js
│   ├── auth.controller.js
│   ├── cart.controller.js
│   ├── category.controller.js
│   ├── contact.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── product.controller.js
│   ├── user.controller.js
│   └── wishlist.controller.js
├── dtos/               
│   ├── addon.dto.js
│   ├── cart.dto.js
│   ├── category.dto.js
│   ├── contact.dto.js
│   ├── order.dto.js
│   ├── payment.dto.js
│   ├── product.dto.js
│   ├── user.dto.js
│   └── wishlist.dto.js
├── middleware/    
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   └── upload.middleware.js   
├── models/            
│   ├── addon.model.js
│   ├── cart.model.js
│   ├── category.model.js
│   ├── contact.model.js
│   ├── order.model.js
│   ├── product.model.js
│   ├── user.model.js
│   └── wishlist.model.js
├── node_modules/
├── repositories/      
│   ├── addon.repository.js
│   ├── cart.repository.js
│   ├── category.repository.js
│   ├── contact.repository.js
│   ├── order.repository.js
│   ├── payment.repository.js
│   ├── product.repository.js
│   ├── user.repository.js
│   └── wishlist.repository.js
├── routes/            
│   ├── addon.routes.js
│   ├── auth.routes.js
│   ├── cart.routes.js
│   ├── category.routes.js
│   ├── contact.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── product.routes.js
│   ├── user.routes.js
│   └── wishlist.routes.js
├── services/       
│   ├── addon.service.js
│   ├── auth.service.js
│   ├── cart.service.js
│   ├── category.service.js
│   ├── contact.service.js
│   ├── order.service.js
│   ├── payment.service.js
│   ├── product.service.js
│   ├── user.service.js
│   └── wishlist.service.js
├── uploads/         
├── utils/      
│   └── sendEmail.js
├── .env             
├── .gitignore
├── package.json
├── package-lock.json
└── server.js         
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rami2212/DigiteX_Ecommerce_Store.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory
   ```env
   Contact me for the .env
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:id` - Remove item from wishlist

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin)

### Addons
- `GET /api/addons` - Get all addons
- `POST /api/addons` - Create addon (admin)
- `PUT /api/addons/:id` - Update addon (admin)
- `DELETE /api/addons/:id` - Delete addon (admin)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Dependencies

### Production Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **passport**: Authentication middleware
- **cors**: Cross-Origin Resource Sharing
- **joi**: Data validation
- **stripe**: Payment processing
- **multer**: File upload handling
- **nodemailer**: Email sending
- **dotenv**: Environment variables management

## Running the Application

1. **Start MongoDB** (make sure MongoDB is running)
2. **Run the backend server**:
   ```bash
   npm run dev
   ```
3. **Server will be available at**: `http://localhost:5000`


## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with Joi
- CORS protection
- Express session management
- File upload restrictions


## 📞 Support

For support, email ramithapathmilarp@gmail.com.

---

**DigiteX** - Laptop Store.