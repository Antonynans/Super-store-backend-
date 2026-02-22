# MERN E-Commerce Store - Backend API

A robust REST API built with Node.js, Express, and MongoDB for a full-featured e-commerce platform.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

- User authentication & authorization (JWT)
- Product management (CRUD operations)
- Category management
- Shopping cart functionality
- Order processing and tracking
- Payment integration (PayPal)
- Admin dashboard with analytics
- Image upload to Cloudinary
- Input validation and error handling
- Role-based access control

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcryptjs
- **File Upload:** Cloudinary
- **Validation:** Custom middleware validators

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Cloudinary Account (for image uploads)
- PayPal Account (for payment processing)

### Setup

```bash
# Clone the repository
git clone https://github.com/Antonynans/super-store-backend.git

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env

# Start the server
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_API_SECRET=your_paypal_api_secret

PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile (Protected)

### Products

- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders

- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin only)

### Upload

- `POST /api/upload` - Upload image to Cloudinary (Protected)

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.js
│   └── db.js
├── controllers/
│   ├── categoryController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── uploadController.js
│   └── userController.js
├── middlewares/
│   ├── asyncHandler.js
│   ├── authMiddleware.js
│   ├── checkId.js
│   └── uploadMiddleware.js
├── models/
│   ├── categoryModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes/
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── uploadRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── seedProducts.js
├── utils/
│   └── createToken.js
├── index.js
└── package.json
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

#### Author: [@Antonynans](https://Github.com/Antonynans)
