# Barcode Inventory Management System - Backend

A Node.js/Express.js backend for a barcode-driven inventory management system with Kanban board style product categorization.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Product Management**: CRUD operations for products with barcode scanning support
- **Category Management**: Dynamic category creation and management
- **Search Functionality**: Search products by barcode, description, or material number
- **Analytics**: Product counts per category and recent products tracking
- **Kanban Integration**: Category-based product organization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **CORS**: Enabled for frontend integration
- **Modules**: ES6 Modules (import/export)

## Project Structure

```
server/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── vercel.json           # Vercel deployment configuration
├── .vercelignore         # Files to exclude from Vercel deployment
├── README.md             # Comprehensive documentation
├── test-api.js           # API testing script
├── models/               # Database models
│   ├── User.js          # User model with authentication
│   ├── Product.js       # Product model with barcode support
│   └── Category.js      # Category model for Kanban organization
├── services/             # Business logic layer
│   ├── authService.js    # Authentication business logic
│   ├── productService.js # Product management business logic
│   ├── categoryService.js # Category management business logic
│   └── analyticsService.js # Analytics business logic
├── controllers/          # HTTP request/response handlers
│   ├── authController.js    # Authentication controllers
│   ├── productController.js # Product controllers
│   ├── categoryController.js # Category controllers
│   └── analyticsController.js # Analytics controllers
├── routes/               # API route definitions
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product management routes
│   ├── categories.js    # Category management routes
│   └── analytics.js     # Analytics and reporting routes
├── middleware/           # Custom middleware
│   └── auth.js          # JWT authentication middleware
└── config/              # Configuration files
    └── seeder.js        # Database seeder for default categories
```

## Architecture Overview

The application follows a **modular MVC pattern** with clear separation of concerns:

### **Services Layer** (`/services`)
- Contains all business logic
- Handles data validation and processing
- Interacts with models for database operations
- Returns structured data to controllers

### **Controllers Layer** (`/controllers`)
- Handles HTTP requests and responses
- Calls appropriate service functions
- Manages error handling and status codes
- Keeps routes clean and focused

### **Routes Layer** (`/routes`)
- Defines API endpoints
- Applies middleware (authentication, validation)
- Maps HTTP methods to controller functions
- Minimal logic, just routing

### **Models Layer** (`/models`)
- Database schemas and validation
- Mongoose model definitions
- Database indexes and hooks

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Local Development

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env with your configuration
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/barcode-inventory
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on port 5000 (or the port specified in your .env file).

## Deployment

### Vercel Deployment

This backend is configured for easy deployment on Vercel with the included `vercel.json` configuration.

#### Prerequisites
- Vercel account
- MongoDB Atlas or other cloud MongoDB instance
- Vercel CLI (optional)

#### Deployment Steps

1. **Prepare Environment Variables**
   ```bash
   # Set these in Vercel dashboard or via CLI
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   ```

2. **Deploy via Vercel Dashboard**
   - Connect your GitHub repository to Vercel
   - Set the root directory to `server`
   - Configure environment variables in the Vercel dashboard
   - Deploy

3. **Deploy via Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Navigate to server directory
   cd server
   
   # Deploy
   vercel
   
   # Follow the prompts and set environment variables
   ```

4. **Environment Variables in Vercel**
   - Go to your project dashboard in Vercel
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `NODE_ENV`: `production`

#### Vercel Configuration

The `vercel.json` file includes:
- **Build Configuration**: Uses `@vercel/node` for Node.js deployment
- **Routing**: Routes all API calls to the main app.js file
- **Function Settings**: Sets max duration to 30 seconds for serverless functions
- **Environment**: Sets NODE_ENV to production

#### Post-Deployment

After deployment, your API will be available at:
```
https://your-project-name.vercel.app/api/
```

Example endpoints:
- `https://your-project-name.vercel.app/api/auth/register`
- `https://your-project-name.vercel.app/api/products`
- `https://your-project-name.vercel.app/health`

### Other Deployment Options

#### Railway
- Similar to Vercel, supports Node.js applications
- Easy environment variable configuration
- Automatic deployments from GitHub

#### Heroku
- Traditional platform-as-a-service
- Requires Procfile configuration
- Good for long-running processes

#### DigitalOcean App Platform
- Container-based deployment
- Good for scaling applications
- Built-in monitoring

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Endpoints (Protected - Requires JWT)

#### Add Product
```http
POST /api/products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "material": 12345,
  "barcode": "1234567890123",
  "description": "Sample Product",
  "category": "In Stock"
}
```

#### Get All Products
```http
GET /api/products
Authorization: Bearer <jwt_token>

# Optional: Filter by category
GET /api/products?category=In%20Stock
```

#### Search Products
```http
GET /api/products/search?q=search_term
Authorization: Bearer <jwt_token>
```

#### Update Product Category
```http
PATCH /api/products/:id/category
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "category": "Stock Out"
}
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <jwt_token>
```

### Category Endpoints (Protected - Requires JWT)

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer <jwt_token>
```

#### Create Category
```http
POST /api/categories
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "New Category"
}
```

#### Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer <jwt_token>
```

### Analytics Endpoints (Protected - Requires JWT)

#### Get Analytics Overview
```http
GET /api/analytics
Authorization: Bearer <jwt_token>
```

#### Get Category Details
```http
GET /api/analytics/categories?category=In%20Stock
Authorization: Bearer <jwt_token>
```

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Product Model
```javascript
{
  material: Number (required, unique),
  barcode: String (required, unique),
  description: String (required),
  category: String (default: "Uncategorized"),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  name: String (required, unique),
  createdAt: Date
}
```

## Default Categories

The system automatically creates these default categories on startup:
- "Uncategorized"
- "In Stock"
- "Stock Out"

## Search Functionality

The search endpoint supports:
- **Exact material number search**: When query is numeric
- **Partial barcode search**: Case-insensitive regex matching
- **Partial description search**: Case-insensitive regex matching

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes requiring valid tokens
- Input validation and sanitization
- CORS enabled for frontend integration

## Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment mode (development/production)

## API Testing

You can test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Remember to include the JWT token in the Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

## Code Organization Benefits

### **Separation of Concerns**
- **Services**: Pure business logic, easily testable
- **Controllers**: HTTP handling, error management
- **Routes**: Clean endpoint definitions
- **Models**: Data structure and validation

### **Maintainability**
- Easy to locate and modify specific functionality
- Clear dependencies between layers
- Consistent error handling patterns
- Reusable service functions

### **Scalability**
- Easy to add new features without affecting existing code
- Clear structure for team collaboration
- Modular testing approach
- Functional programming style for better performance

### **Testing**
- Services can be unit tested independently
- Controllers can be tested with mocked services
- Clear boundaries for integration testing

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong, unique `JWT_SECRET`
3. Configure a production MongoDB instance
4. Set up proper CORS origins
5. Use environment variables for all sensitive data
6. Consider using a process manager like PM2

## License

ISC License 