# MarketNest - Mini Fashion Marketplace

A full-stack e-commerce web application for fashion products, connecting brands (sellers) with customers. Built with the MERN stack (MongoDB, Express, React, Node.js).

![MarketNest](./frontend/public/logo.png)

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Authentication Flow](#authentication-flow)
- [Folder Structure](#folder-structure)
- [Security Decisions](#security-decisions)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Features](#features)
- [AI Tool Usage](#ai-tool-usage)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Pages   │  │Components │  │ Context  │  │ Services │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (Express.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Routes   │  │Controller│  │ Middleware│  │  Utils   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │   Users  │  │ Products │  │  Orders  │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Cloudinary API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │  Cloudinary  │  │   JWT Auth   │                           │
│  │  (Images)    │  │   (Tokens)   │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

1. **MVC Pattern (Backend)**
   - **Models**: Database schemas (User, Product, Order)
   - **Views**: Not applicable (REST API)
   - **Controllers**: Business logic handlers

2. **Component-Based Architecture (Frontend)**
   - Reusable React components
   - Page-level components for routing
   - Context API for state management

3. **RESTful API Design**
   - Resource-oriented URLs
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - JSON request/response format

---

## 🔐 Authentication Flow

### JWT-Based Authentication with Refresh Tokens

```
┌─────────────────────────────────────────────────────────────────┐
│                      Registration Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User submits: name, email, password, role                  │
│                          ▼                                      │
│  2. Backend validates input & checks for existing user          │
│                          ▼                                      │
│  3. Password hashed with bcrypt (10 salt rounds)               │
│                          ▼                                      │
│  4. User saved to MongoDB with role (brand/customer)            │
│                          ▼                                      │
│  5. Success response sent (no tokens on registration)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Login Flow                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User submits: email, password                               │
│                          ▼                                      │
│  2. Backend finds user by email                                 │
│                          ▼                                      │
│  3. Password verified with bcrypt.compare()                     │
│                          ▼                                      │
│  4. Generate Access Token (15 min expiry)                       │
│                          ▼                                      │
│  5. Generate Refresh Token (7 days expiry)                     │
│                          ▼                                      │
│  6. Store Refresh Token in:                                     │
│     - Database (User.refreshToken)                               │
│     - HTTP-only Cookie                                           │
│                          ▼                                      │
│  7. Return: Access Token + User Info                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Token Refresh Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Frontend detects 401 (Unauthorized)                         │
│                          ▼                                      │
│  2. Send Refresh Token from cookie to /api/auth/refresh         │
│                          ▼                                      │
│  3. Backend verifies Refresh Token                              │
│                          ▼                                      │
│  4. Generate new Access Token                                  │
│                          ▼                                      │
│  5. Return new Access Token                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Logout Flow                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Frontend calls /api/auth/logout                            │
│                          ▼                                      │
│  2. Backend clears Refresh Token from:                          │
│     - Database                                                  │
│     - HTTP-only Cookie                                          │
│                          ▼                                      │
│  3. Frontend clears Access Token from localStorage              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

| Role | Access Level |
|------|--------------|
| `brand` | Seller Dashboard, Product Management, Order Management |
| `customer` | Browse Products, View Details, Place Orders |

---

## 📁 Folder Structure

```
MarketNest/
├── backend/                    # Express.js API Server
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Authentication handlers
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorMiddleware.js # Error handling
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/                # Helper functions
│   │   ├── jwtUtils.js       # JWT token generation/verification
│   │   └── cloudinary.js     # Image upload configuration
│   ├── server.js             # Express app entry point
│   ├── package.json
│   └── .env.example          # Environment variables template
│
├── frontend/                  # React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # React Context for state
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── BrandDashboard.jsx
│   │   │   ├── BrandProducts.jsx
│   │   │   └── ...
│   │   ├── services/         # API communication
│   │   │   └── api.js       # Axios instance with interceptors
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── package.json              # Root package.json (scripts)
├── SPEC.md                   # Project specification
└── README.md                 # This file
```

### Backend Structure Details

| Directory | Purpose |
|-----------|---------|
| `config/` | Database and service configurations |
| `controllers/` | Request handlers and business logic |
| `middleware/` | Authentication and error handling middleware |
| `models/` | Mongoose schemas for MongoDB collections |
| `routes/` | Express router definitions |
| `utils/` | JWT and Cloudinary helper functions |

### Frontend Structure Details

| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components (Navbar, ProductCard) |
| `context/` | Global state management (AuthContext) |
| `pages/` | Full page components for each route |
| `services/` | API communication layer |

---

## 🛡️ Security Decisions

### 1. Password Security

- **bcrypt hashing** with 10 salt rounds
- Never store plain-text passwords
- Password validation (minimum 6 characters)

```javascript
// Hashing during registration
const hashedPassword = await bcrypt.hash(password, 10);

// Verification during login
const isMatch = await bcrypt.compare(password, user.password);
```

### 2. JWT Token Strategy

- **Access Token**: Short-lived (15 minutes) - stored in frontend memory/localStorage
- **Refresh Token**: Long-lived (7 days) - stored in HTTP-only cookie

```javascript
// Access Token
jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

// Refresh Token  
jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
```

### 3. CORS Configuration

- Strict origin checking
- Credentials allowed
- Specific HTTP methods only

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

### 4. Protected Routes

- Middleware verifies JWT on protected routes
- Role-based access control enforced
- Ownership verification for brand resources

### 5. HTTP-Only Cookies

- Refresh tokens stored in HTTP-only cookies
- JavaScript cannot access cookies
- XSS attacks mitigated

### 6. Input Validation

- Server-side validation on all inputs
- MongoDB injection prevention
- XSS prevention in React (automatic escaping)

---

## 💻 Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM (Object Data Modeling) |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary | Image storage & CDN |
| dotenv | Environment variables |

### Frontend

| Technology | Purpose |
|------------|---------|
| React | UI framework |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| Context API | State management |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for images)

### Installation

1. **Clone the repository**
   ```bash
   cd MarketNest
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd backend && npm install
   
   # Frontend dependencies  
   cd frontend && npm install
   ```

3. **Configure environment variables**

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLIENT_URL=http://localhost:5173
   ```

4. **Run development servers**
   ```bash
   npm run dev
   ```

   This runs both frontend (port 5173) and backend (port 5001).

### Production Build

```bash
# Frontend build
cd frontend && npm run build
```

---

## ✨ Features

### Customer Features
- [x] Browse all products
- [x] Search products by name
- [x] Filter by category
- [x] View product details
- [x] Server-side pagination
- [x] User registration & login
- [x] Order history

### Brand (Seller) Features
- [x] Brand dashboard with statistics
- [x] Create products with multiple images
- [x] Upload images to Cloudinary
- [x] Edit own products
- [x] Archive products
- [x] View incoming orders
- [x] Payment settings

### Technical Features
- [x] JWT authentication
- [x] Refresh token rotation
- [x] Role-based access control
- [x] RESTful API
- [x] Responsive design
- [x] Error handling

---

## 🤖 AI Tool Usage

### Where AI Tools Were Used

1. **Code Generation & Refactoring**
   - Initial project structure setup
   - Component templates
   - Authentication flow implementation
   - API route handlers

2. **UI/UX Enhancements**
   - Professional e-commerce homepage design
   - Category icons with Flipkart-style layout
   - Attractive navbar with hover effects
   - Professional login/signup pages with split-screen design
   - Responsive design improvements

3. **Documentation**
   - README.md creation
   - Code comments and explanations

### Specific Improvements Made

| Feature | AI Contribution |
|---------|-----------------|
| Home.jsx redesign | Category icons, hero banner, search box, static sections |
| Navbar styling | Enhanced gradients, hover effects, dropdown menus |
| Login/Signup pages | Split-screen design, role selection, social login UI |
| About/Contact pages | Created new pages with professional content |

### Limitations & Manual Work

- Business logic in controllers
- Database schema design
- Security middleware implementation
- Environment configuration
- API testing

---

## 📄 License

This project is for educational purposes.

---

## 👤 Author

Built with ❤️ using MERN Stack

