# 🌾 FarmerMarket - Farm-to-Table Marketplace

A modern, beautiful e-commerce platform connecting local farmers with consumers. Built with Next.js, Node.js, Express, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Local Setup Guide](#-local-setup-guide)
- [MongoDB Setup](#-mongodb-setup-guide)
- [Database Schema](#-database-schema--structure)
- [API Documentation](#-api-documentation)
- [Demo Accounts](#-demo-accounts)
- [Deployment](#-deployment-guide)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### For Buyers
- 🛒 Browse marketplace with category filters (Vegetables, Fruits, Grains, Dairy)
- 🔍 View detailed product information with images
- 🛍️ Add items to cart with quantity management
- 📦 Place orders with Cash on Delivery
- 📊 Track order status (requested → accepted → completed)
- ⭐ Review completed orders and rate farmers
- 📈 View farmer trust scores

### For Farmers
- 🌱 Create product listings with image uploads
- 💰 Set custom prices and quantities
- 📅 Manage product expiry dates
- 📋 View and manage incoming orders
- ✅ Accept/reject order requests
- 📊 Track sales and listings

### Design & UX
- 🎨 Beautiful 4-color nature-inspired palette
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast loading with React Query caching
- 🔐 JWT-based authentication
- 🎭 Role-based access control
- 🖼️ Image upload support

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Headless UI** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-rate-limit** - API rate limiting

## 📦 Project Structure

```
farmer-marketplace/
├── client/                      # Next.js Frontend Application
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.js          # Root layout with providers
│   │   ├── page.js            # Landing page
│   │   ├── globals.css        # Global styles
│   │   ├── home/              # Marketplace homepage
│   │   │   └── page.js        # Browse products
│   │   ├── cart/              # Shopping cart
│   │   │   └── page.js        # Cart management
│   │   ├── orders/            # Order management
│   │   │   └── page.js        # Order history & status
│   │   ├── profile/           # User profile
│   │   │   └── page.js        # Profile information
│   │   ├── sell/              # Farmer dashboard
│   │   │   └── page.js        # Create listings
│   │   ├── product/           # Product details
│   │   │   └── [id]/page.js   # Dynamic product page
│   │   ├── login/             # Authentication
│   │   │   └── page.js        # Login form
│   │   └── register/          # User registration
│   │       └── page.js        # Registration form
│   ├── components/             # React Components
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.js      # Button variants
│   │   │   ├── Card.js        # Card component
│   │   │   ├── Input.js       # Form inputs
│   │   │   ├── Badge.js       # Status badges
│   │   │   ├── Select.js      # Dropdown select
│   │   │   ├── ErrorBanner.js # Error display
│   │   │   └── PageLoader.js  # Loading state
│   │   ├── layout/            # Layout components
│   │   │   ├── Navbar.js      # Navigation bar
│   │   │   └── Footer.js      # Footer
│   │   ├── forms/             # Form components
│   │   └── ListingCard.js     # Product listing card
│   ├── lib/                    # Utilities & Helpers
│   │   ├── api.js             # API client
│   │   ├── auth.js            # Auth helpers
│   │   ├── i18n.js            # Internationalization
│   │   ├── providers.js       # React Query provider
│   │   └── useSession.js      # Session hook
│   ├── package.json           # Dependencies
│   ├── next.config.js         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── .env.example           # Environment template
│
└── server/                     # Express Backend Application
    ├── src/
    │   ├── controllers/       # Route Controllers
    │   │   ├── authController.js    # Auth logic
    │   │   ├── userController.js    # User management
    │   │   ├── productController.js # Product CRUD
    │   │   ├── listingController.js # Listing CRUD
    │   │   ├── cartController.js    # Cart operations
    │   │   ├── orderController.js   # Order management
    │   │   └── reviewController.js  # Review system
    │   ├── models/            # MongoDB Models
    │   │   ├── User.js        # User schema
    │   │   ├── Product.js     # Product schema
    │   │   ├── Listing.js     # Listing schema
    │   │   ├── Cart.js        # Cart schema
    │   │   ├── Order.js       # Order schema
    │   │   └── Review.js      # Review schema
    │   ├── routes/            # API Routes
    │   │   ├── authRoutes.js
    │   │   ├── userRoutes.js
    │   │   ├── productRoutes.js
    │   │   ├── listingRoutes.js
    │   │   ├── cartRoutes.js
    │   │   ├── orderRoutes.js
    │   │   └── reviewRoutes.js
    │   ├── middleware/        # Express Middleware
    │   │   └── auth.js        # JWT verification
    │   ├── config/            # Configuration
    │   │   └── db.js          # MongoDB connection
    │   └── utils/             # Utility Functions
    │       ├── categories.js  # Product categories
    │       ├── demoData.js    # Seed data
    │       ├── jwt.js         # JWT helpers
    │       ├── seed.js        # Database seeder
    │       └── upload.js      # Multer config
    ├── uploads/               # Uploaded Images
    │   └── .gitkeep          # Preserve folder
    ├── server.js             # App entry point
    ├── package.json          # Dependencies
    └── .env.example          # Environment template
```

## 🚀 Local Setup Guide

Follow these steps to set up the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | v18.0.0+ | [nodejs.org](https://nodejs.org) |
| npm | v9.0.0+ | (included with Node.js) |
| MongoDB | v6.0+ | See [MongoDB Setup](#-mongodb-setup-guide) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/farmer-marketplace.git

# Navigate to project directory
cd farmer-marketplace
```

### Step 2: Install MongoDB

See the detailed [MongoDB Setup Guide](#-mongodb-setup-guide) below for your operating system.

### Step 3: Configure Environment Variables

#### Backend Environment Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file from the template:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

3. Edit `server/.env` and update the values:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/farmer_marketplace
   
   # JWT Secret (change this to a random string)
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this
   
   # CORS Configuration
   CLIENT_ORIGIN=http://localhost:3000
   ```

   **Important**: Generate a strong JWT_SECRET:
   ```bash
   # Node.js command to generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

#### Frontend Environment Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Create a `.env.local` file from the template:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env.local
   
   # macOS/Linux
   cp .env.example .env.local
   ```

3. Edit `client/.env.local`:
   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Step 4: Install Dependencies

#### Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- express, cors, morgan (server framework)
- mongoose (MongoDB ODM)
- jsonwebtoken, bcryptjs (authentication)
- multer (file uploads)
- express-rate-limit (security)
- dotenv (environment variables)
- nodemon (development)

#### Install Frontend Dependencies

```bash
cd ../client
npm install
```

This installs:
- next, react, react-dom (framework)
- @tanstack/react-query (data fetching)
- react-hook-form, zod (forms & validation)
- tailwindcss (styling)
- lucide-react (icons)
- @headlessui/react (UI components)

### Step 5: Seed the Database

Populate your database with demo data including users, products, listings, orders, and reviews.

```bash
cd ../server
npm run seed
```

**Expected Output:**
```
✓ Connected to MongoDB
✓ Database cleared
✓ Created 4 users (3 farmers, 1 buyer)
✓ Created 16 products
✓ Created 16 listings
✓ Created 3 orders
✓ Created 1 review
✅ Database seeded successfully!
```

**Seed Data Includes:**
- **3 Farmer Accounts**: farmer1@test.com, farmer2@test.com, farmer3@test.com
- **1 Buyer Account**: buyer1@test.com
- **All passwords**: `password123`
- **16+ Products**: Tomatoes, Rice, Milk, Fresh Vegetables, Apples, Oranges, Wheat, etc.
- **Active Listings**: Products ready to purchase
- **Sample Orders**: Completed, accepted, and requested states
- **Reviews**: Rating system with comments

### Step 6: Start the Development Servers

You need to run both the backend and frontend servers simultaneously.

#### Terminal 1 - Backend Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] starting `node server.js`
✓ MongoDB connected
Server running on port 5000
```

#### Terminal 2 - Frontend Server

Open a **new terminal** window/tab:

```bash
cd client
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in Xms
```

### Step 7: Access the Application

Open your browser and navigate to:

🌐 **http://localhost:3000**

You should see the landing page with:
- Hero section with call-to-action
- Login/Register buttons
- Navigation bar

#### Test Login

Use any of these demo accounts:

**For Farmer Experience:**
- Email: `farmer1@test.com`
- Password: `password123`

**For Buyer Experience:**
- Email: `buyer1@test.com`
- Password: `password123`

### 🎉 Setup Complete!

Your local development environment is now ready. You can:
- Browse the marketplace at `/home`
- Create listings as a farmer at `/sell`
- Add items to cart and place orders
- Manage orders at `/orders`
- Leave reviews on completed orders

---

## 🍃 MongoDB Setup Guide

Detailed instructions for installing and configuring MongoDB on different operating systems.

### Option 1: MongoDB Community Server (Local)

#### Windows

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: 6.0 or higher
   - Package: MSI

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install MongoDB as a **Service** (recommended)
   - Install **MongoDB Compass** (GUI tool)

3. **Verify Installation:**
   ```powershell
   # Check MongoDB is running
   Get-Service MongoDB
   
   # Or check version
   mongod --version
   ```

4. **Connection String:**
   ```
   mongodb://localhost:27017/farmer_marketplace
   ```

#### macOS

**Using Homebrew (Recommended):**

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Tap MongoDB formula
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@6.0

# Start MongoDB service
brew services start mongodb-community@6.0

# Verify installation
mongod --version
```

**Manual Installation:**
1. Download from: https://www.mongodb.com/try/download/community
2. Extract to `/usr/local/mongodb`
3. Add to PATH: `export PATH=/usr/local/mongodb/bin:$PATH`
4. Create data directory: `sudo mkdir -p /usr/local/var/mongodb`
5. Start: `mongod --dbpath /usr/local/var/mongodb`

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify installation
mongod --version

# Check service status
sudo systemctl status mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Beginners)

MongoDB Atlas provides a free cloud-hosted MongoDB instance.

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create a Free Cluster:**
   - Choose **FREE** tier (M0)
   - Select cloud provider (AWS/Google/Azure)
   - Choose region closest to you
   - Cluster name: `farmer-marketplace`
   - Click **Create Cluster**

3. **Create Database User:**
   - Go to **Database Access**
   - Click **Add New Database User**
   - Authentication Method: **Password**
   - Username: `farmadmin`
   - Password: Generate secure password (save it!)
   - User Privileges: **Read and write to any database**
   - Click **Add User**

4. **Whitelist IP Address:**
   - Go to **Network Access**
   - Click **Add IP Address**
   - Choose **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add your current IP
   - Click **Confirm**

5. **Get Connection String:**
   - Go to **Database** → Click **Connect**
   - Choose **Connect your application**
   - Driver: **Node.js**
   - Copy the connection string:
   ```
   mongodb+srv://farmadmin:<password>@farmer-marketplace.xxxxx.mongodb.net/farmer_marketplace?retryWrites=true&w=majority
   ```

6. **Update `.env` File:**
   ```env
   MONGO_URI=mongodb+srv://farmadmin:YOUR_PASSWORD@farmer-marketplace.xxxxx.mongodb.net/farmer_marketplace?retryWrites=true&w=majority
   ```
   
   **Important:** Replace `<password>` with your actual password!

### Verify MongoDB Connection

Test your MongoDB connection:

```bash
# Backend directory
cd server

# Node.js test
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_marketplace').then(() => console.log('✅ MongoDB Connected!')).catch(err => console.error('❌ Connection Error:', err))"
```

### MongoDB GUI Tools (Optional)

#### MongoDB Compass (Official)
- Download: https://www.mongodb.com/products/compass
- Visual interface for MongoDB
- Great for viewing data structure

#### Studio 3T (Alternative)
- Download: https://studio3t.com/download/
- Advanced features, free trial

---

## 🗄️ Database Schema & Structure

Complete documentation of the MongoDB database structure.

### Collections Overview

The database `farmer_marketplace` contains 6 main collections:

| Collection | Purpose | Documents |
|------------|---------|-----------|
| `users` | User accounts (farmers, buyers, admins) | User profiles |
| `products` | Product catalog created by farmers | Product details |
| `listings` | Active marketplace listings with pricing | Available products |
| `carts` | Shopping carts for buyers | Cart items |
| `orders` | Purchase orders and transactions | Order history |
| `reviews` | Ratings and feedback for orders | Review data |

### 1. Users Collection

Stores all user accounts with role-based access.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,              // User's full name
  email: String,             // Unique email (lowercased)
  passwordHash: String,      // bcrypt hashed password
  role: String,              // Enum: 'farmer' | 'buyer' | 'admin'
  languagePreference: String,// Default: 'en'
  address: String,           // User's delivery address
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

**Example Document:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Ravi Patil",
  "email": "farmer1@test.com",
  "passwordHash": "$2a$10$...",
  "role": "farmer",
  "languagePreference": "en",
  "address": "Village Pune, Maharashtra",
  "createdAt": "2026-02-26T10:30:00.000Z",
  "updatedAt": "2026-02-26T10:30:00.000Z"
}
```

**Indexes:**
- `email`: Unique index for fast lookups

**Roles:**
- **farmer**: Can create products and listings, manage orders
- **buyer**: Can browse, add to cart, place orders, write reviews
- **admin**: Full system access (future feature)

### 2. Products Collection

Product catalog items created by farmers.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,              // Product name
  description: String,       // Product description
  category: String,          // Enum: 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy' | 'Others'
  images: [String],          // Array of image filenames
  createdBy: ObjectId,       // Reference to User (farmer)
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "name": "Fresh Tomatoes",
  "description": "Organic tomatoes from my farm",
  "category": "Vegetables",
  "images": ["tomato-001.jpg", "tomato-002.jpg"],
  "createdBy": "65f1a2b3c4d5e6f7g8h9i0j1",
  "createdAt": "2026-02-26T10:35:00.000Z",
  "updatedAt": "2026-02-26T10:35:00.000Z"
}
```

**Categories:**
- Vegetables
- Fruits
- Grains
- Dairy
- Others

### 3. Listings Collection

Active marketplace listings with pricing and inventory.

**Schema:**
```javascript
{
  _id: ObjectId,
  productId: ObjectId,       // Reference to Product
  createdBy: ObjectId,       // Reference to User (farmer)
  price: Number,             // Price per unit (minimum: 0)
  quantity: Number,          // Available quantity (minimum: 0)
  unit: String,              // Enum: 'kg' | 'litre' | 'dozen'
  expiryDate: Date,          // Product expiry date
  isActive: Boolean,         // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "productId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "createdBy": "65f1a2b3c4d5e6f7g8h9i0j1",
  "price": 45.50,
  "quantity": 100,
  "unit": "kg",
  "expiryDate": "2026-03-15T00:00:00.000Z",
  "isActive": true,
  "createdAt": "2026-02-26T10:40:00.000Z",
  "updatedAt": "2026-02-26T10:40:00.000Z"
}
```

**Units:**
- `kg`: Kilograms (for vegetables, fruits, grains)
- `litre`: Litres (for milk, juice, oil)
- `dozen`: Dozen (for eggs, bunches)

**Business Logic:**
- Only active listings (`isActive: true`) appear in marketplace
- Farmers can deactivate listings without deleting them
- Expired listings can be filtered out on frontend

### 4. Carts Collection

Shopping carts for buyers.

**Schema:**
```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Reference to User (buyer) - Unique
  seller: ObjectId | null,   // Reference to User (farmer) - Enforces single seller per cart
  items: [
    {
      _id: ObjectId,         // Cart item ID
      listing: ObjectId,     // Reference to Listing
      product: ObjectId,     // Reference to Product
      quantity: Number,      // Quantity to purchase (minimum: 1)
      priceSnapshot: Number, // Price at time of adding to cart
      unit: String          // Enum: 'kg' | 'litre' | 'dozen'
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
  "user": "65f1a2b3c4d5e6f7g8h9i0j5",
  "seller": "65f1a2b3c4d5e6f7g8h9i0j1",
  "items": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
      "listing": "65f1a2b3c4d5e6f7g8h9i0j3",
      "product": "65f1a2b3c4d5e6f7g8h9i0j2",
      "quantity": 5,
      "priceSnapshot": 45.50,
      "unit": "kg"
    }
  ],
  "createdAt": "2026-02-26T11:00:00.000Z",
  "updatedAt": "2026-02-26T11:05:00.000Z"
}
```

**Business Logic:**
- One cart per user (unique constraint on `user` field)
- Cart can only contain items from ONE seller
- `priceSnapshot` captures price at time of adding (protects from price changes)
- Cart persists across sessions

### 5. Orders Collection

Purchase orders and transaction records.

**Schema:**
```javascript
{
  _id: ObjectId,
  buyer: ObjectId,           // Reference to User (buyer)
  seller: ObjectId,          // Reference to User (farmer)
  items: [
    {
      listing: ObjectId,     // Reference to Listing
      product: ObjectId,     // Reference to Product
      quantity: Number,      // Ordered quantity
      price: Number,         // Price per unit at time of order
      unit: String          // Enum: 'kg' | 'litre' | 'dozen'
    }
  ],
  totalAmount: Number,       // Total order cost
  status: String,            // Enum: 'requested' | 'accepted' | 'completed' | 'cancelled' | 'rejected'
  paymentMethod: String,     // Enum: 'cod' (Cash on Delivery)
  createdAt: Date,           // Order placement time
  updatedAt: Date           // Last status update time
}
```

**Example Document:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j7",
  "buyer": "65f1a2b3c4d5e6f7g8h9i0j5",
  "seller": "65f1a2b3c4d5e6f7g8h9i0j1",
  "items": [
    {
      "listing": "65f1a2b3c4d5e6f7g8h9i0j3",
      "product": "65f1a2b3c4d5e6f7g8h9i0j2",
      "quantity": 5,
      "price": 45.50,
      "unit": "kg"
    }
  ],
  "totalAmount": 227.50,
  "status": "requested",
  "paymentMethod": "cod",
  "createdAt": "2026-02-26T12:00:00.000Z",
  "updatedAt": "2026-02-26T12:00:00.000Z"
}
```

**Order Status Flow:**
```
requested → accepted → completed
    ↓
cancelled / rejected
```

- **requested**: Order placed by buyer, awaiting farmer acceptance
- **accepted**: Farmer accepted order, preparing delivery
- **completed**: Order delivered and completed
- **cancelled**: Buyer cancelled the order
- **rejected**: Farmer rejected the order

**Business Logic:**
- Only `completed` orders can be reviewed
- Order items snapshot the listing/product data at time of purchase
- Total amount is calculated and stored (not computed dynamically)

### 6. Reviews Collection

Ratings and feedback for completed orders.

**Schema:**
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,         // Reference to Order - Unique (one review per order)
  reviewerId: ObjectId,      // Reference to User (buyer who reviewed)
  sellerId: ObjectId,        // Reference to User (farmer being reviewed) - Indexed
  rating: Number,            // 1-5 stars (minimum: 1, maximum: 5)
  comment: String,           // Review comment (max 500 characters)
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j8",
  "orderId": "65f1a2b3c4d5e6f7g8h9i0j7",
  "reviewerId": "65f1a2b3c4d5e6f7g8h9i0j5",
  "sellerId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "rating": 5,
  "comment": "Excellent quality tomatoes! Fresh and delivered on time.",
  "createdAt": "2026-02-26T14:00:00.000Z",
  "updatedAt": "2026-02-26T14:00:00.000Z"
}
```

**Indexes:**
- `orderId`: Unique index (prevents duplicate reviews)
- `sellerId`: Index for fast farmer rating lookups

**Business Logic:**
- One review per completed order
- Only buyers can review
- Reviews contribute to farmer trust score
- Trust Score = (Average Rating × 0.7) + (Completed Orders × 0.3)

### Relationships Diagram

```
User (Farmer)
  ↓ creates
Product
  ↓ has
Listing
  ↓ added to
Cart ← belongs to → User (Buyer)
  ↓ checkout creates
Order
  ↓ completed order gets
Review
```

### Data Validation

All schemas enforce validation at the database level:
- **Required fields**: Marked with `required: true`
- **Enums**: Restricted values
- **Min/Max**: Number constraints
- **Unique constraints**: Prevent duplicates
- **Indexes**: Optimize query performance
- **Timestamps**: Automatic `createdAt` and `updatedAt`

---

## 📡 API Documentation

Complete REST API reference for the backend.

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Body |
|--------|----------|-------------|---------------|------|
| POST | `/api/auth/register` | Register new user | No | `{ name, email, password, role, address }` |
| POST | `/api/auth/login` | User login | No | `{ email, password }` |
| GET | `/api/auth/me` | Get current user | Yes | - |

**Example: Register**
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Farmer",
  "email": "john@farm.com",
  "password": "securepass123",
  "role": "farmer",
  "address": "Village Road, Punjab"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Farmer", "email": "...", "role": "farmer" },
    "token": "eyJhbGc..."
  }
}
```

**Example: Login**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer1@test.com",
  "password": "password123"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

#### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| GET | `/api/users/:id/trust` | Get farmer trust score | No |

**Example: Get Trust Score**
```javascript
GET /api/users/65f1a2b3.../trust

// Response (200)
{
  "success": true,
  "data": {
    "farmerId": "65f1a2b3...",
    "totalReviews": 5,
    "avgRating": 4.6,
    "completedOrders": 12,
    "trustScore": 4.82
  }
}
```

#### Product Routes (`/api/products`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/products` | Create product | Yes | Farmer |
| POST | `/api/products/upload` | Upload image | Yes | Farmer |
| GET | `/api/products` | Get all products | No | - |
| GET | `/api/products/:id` | Get product details | No | - |
| DELETE | `/api/products/:id` | Delete product | Yes | Farmer (owner) |

**Example: Create Product**
```javascript
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Organic Apples",
  "description": "Fresh apples from Himachal",
  "category": "Fruits",
  "images": ["apple-001.jpg"]
}

// Response (201)
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Organic Apples",
    "category": "Fruits",
    "createdBy": "...",
    "createdAt": "..."
  }
}
```

**Example: Upload Image**
```javascript
POST /api/products/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

// Form data with 'image' field

// Response (200)
{
  "success": true,
  "data": {
    "imageUrl": "apple-1234567890.jpg"
  }
}
```

#### Listing Routes (`/api/listings`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/listings` | Create listing | Yes | Farmer |
| GET | `/api/listings` | Get all active listings | No | - |
| GET | `/api/listings/:id` | Get listing details | No | - |
| GET | `/api/listings/my/listings` | Get my listings | Yes | Farmer |
| PATCH | `/api/listings/:id` | Update listing | Yes | Farmer (owner) |
| PATCH | `/api/listings/:id/deactivate` | Deactivate listing | Yes | Farmer (owner) |

**Example: Create Listing**
```javascript
POST /api/listings
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "65f1a2b3...",
  "price": 120.50,
  "quantity": 50,
  "unit": "kg",
  "expiryDate": "2026-03-30"
}

// Response (201)
{
  "success": true,
  "data": {
    "_id": "...",
    "productId": "...",
    "price": 120.50,
    "quantity": 50,
    "unit": "kg",
    "isActive": true
  }
}
```

**Example: Get Marketplace Listings**
```javascript
GET /api/listings?category=Vegetables&limit=20

// Response (200)
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "productId": {
        "_id": "...",
        "name": "Tomatoes",
        "description": "...",
        "category": "Vegetables",
        "images": ["..."]
      },
      "price": 45.50,
      "quantity": 100,
      "unit": "kg",
      "createdBy": {
        "_id": "...",
        "name": "Ravi Patil"
      }
    }
  ]
}
```

#### Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/cart` | Get my cart | Yes | Buyer |
| POST | `/api/cart` | Add item to cart | Yes | Buyer |
| PATCH | `/api/cart/items/:itemId` | Update cart item quantity | Yes | Buyer |
| DELETE | `/api/cart/items/:itemId` | Remove cart item | Yes | Buyer |
| DELETE | `/api/cart` | Clear cart | Yes | Buyer |

**Example: Add to Cart**
```javascript
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "listingId": "65f1a2b3...",
  "quantity": 5
}

// Response (200)
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "seller": "...",
    "items": [
      {
        "_id": "...",
        "listing": "...",
        "product": { ... },
        "quantity": 5,
        "priceSnapshot": 45.50
      }
    ]
  }
}
```

#### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/orders` | Place order from cart | Yes | Buyer |
| GET | `/api/orders/my/orders` | Get my orders (buyer/seller) | Yes | Both |
| GET | `/api/orders/:id` | Get order details | Yes | Owner |
| PATCH | `/api/orders/:id/status` | Update order status | Yes | Seller |

**Example: Place Order**
```javascript
POST /api/orders
Authorization: Bearer <token>

// Uses items from cart, no body needed

// Response (201)
{
  "success": true,
  "data": {
    "_id": "...",
    "buyer": "...",
    "seller": "...",
    "items": [ ... ],
    "totalAmount": 227.50,
    "status": "requested",
    "paymentMethod": "cod"
  }
}
```

**Example: Update Order Status**
```javascript
PATCH /api/orders/65f1a2b3.../status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted"
}

// Response (200)
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "accepted",
    "updatedAt": "..."
  }
}
```

#### Review Routes (`/api/reviews`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/reviews` | Create review | Yes | Buyer |
| GET | `/api/reviews/seller/:sellerId` | Get reviews for farmer | No | - |
| GET | `/api/reviews/order/:orderId/check` | Check if order reviewed | Yes | Buyer |

**Example: Create Review**
```javascript
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "65f1a2b3...",
  "rating": 5,
  "comment": "Excellent quality products!"
}

// Response (201)
{
  "success": true,
  "data": {
    "_id": "...",
    "orderId": "...",
    "reviewerId": "...",
    "sellerId": "...",
    "rating": 5,
    "comment": "Excellent quality products!"
  }
}
```

### Error Responses

All endpoints follow a consistent error response format:

```javascript
// 400 Bad Request
{
  "success": false,
  "message": "Validation error message",
  "code": 400
}

// 401 Unauthorized
{
  "success": false,
  "message": "Not authorized",
  "code": 401
}

// 404 Not Found
{
  "success": false,
  "message": "Resource not found",
  "code": 404
}

// 500 Server Error
{
  "success": false,
  "message": "Server error",
  "code": 500,
  "stack": "..." // Only in development
}
```

### Rate Limiting

API is protected with rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Header**: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

---

## 👥 Demo Accounts

After running `npm run seed`, you can log in with these accounts:

### 🌾 Farmer Accounts

| Name | Email | Password | Test Cases |
|------|-------|----------|------------|
| **Ravi Patil** | farmer1@test.com | password123 | Create listings, manage orders |
| **Priya Kumar** | farmer2@test.com | password123 | Multiple products, reviews |
| **Rajesh Singh** | farmer3@test.com | password123 | Different categories |

**Farmer Capabilities:**
- Create products with image uploads
- Create listings with pricing
- View incoming orders
- Accept/reject/complete orders
- View farmer dashboard
- Check trust score and reviews

### 🛒 Buyer Account

| Name | Email | Password | Test Cases |
|------|-------|----------|------------|
| **Anita Sharma** | buyer1@test.com | password123 | Shopping, orders, reviews |

**Buyer Capabilities:**
- Browse marketplace
- Filter by categories
- Add items to cart
- Place orders (COD)
- Track order status
- Write reviews for completed orders
- View order history

### Quick Test Flows

**Test 1: Complete Purchase Flow (Buyer)**
1. Login as `buyer1@test.com`
2. Go to `/home` - Browse products
3. Click a product → View details
4. Add to cart → Go to `/cart`
5. Place order
6. Go to `/orders` → See order status

**Test 2: Order Management (Farmer)**
1. Login as `farmer1@test.com`
2. Go to `/orders` → See incoming orders
3. Accept an order
4. Mark as completed
5. View your trust score

**Test 3: Create Listing (Farmer)**
1. Login as `farmer1@test.com`
2. Go to `/sell`
3. Create new product with image
4. Set price, quantity, expiry
5. Submit → See in marketplace

---

## 🐛 Troubleshooting

Common issues and solutions when setting up locally.

### Issue: MongoDB Connection Failed

**Error Message:**
```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   Get-Service MongoDB
   
   # macOS
   brew services list | grep mongodb
   
   # Linux
   sudo systemctl status mongod
   ```

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Check connection string in `.env`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/farmer_marketplace
   ```

4. **If using MongoDB Atlas**, verify:
   - IP address whitelisted (0.0.0.0/0 or your IP)
   - Username/password correct in connection string
   - Database name specified

### Issue: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill the process:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. **Or change port in `server/.env`:**
   ```env
   PORT=5001
   ```
   
   Then update `client/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

### Issue: JWT Token Invalid

**Error Message:**
```
401 Unauthorized: jwt malformed
```

**Solutions:**

1. **Clear browser localStorage:**
   ```javascript
   // Open browser console (F12)
   localStorage.clear()
   ```

2. **Logout and login again** - Gets fresh token

3. **Check JWT_SECRET matches** between `.env` and running server

### Issue: Images Not Uploading

**Error Message:**
```
500 Server Error on /api/products/upload
```

**Solutions:**

1. **Check uploads folder exists:**
   ```bash
   # Create if missing
   mkdir server/uploads
   ```

2. **Check file size** (max 5MB by default)

3. **Check file format** (jpg, jpeg, png only)

4. **Verify Multer configuration** in `server/src/utils/upload.js`

### Issue: npm install Fails

**Error Message:**
```
npm ERR! code ERESOLVE
```

**Solutions:**

1. **Use legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Next.js Build Fails

**Error Message:**
```
Error: Build optimization failed
```

**Solutions:**

1. **Check Node.js version** (must be 18+):
   ```bash
   node --version
   ```

2. **Clear Next.js cache:**
   ```bash
   cd client
   rm -rf .next
   npm run dev
   ```

3. **Check for missing environment variables** in `client/.env.local`

### Issue: Categories Not Showing

**Problem:** Category filter shows no products

**Solutions:**

1. **Run seed script again:**
   ```bash
   cd server
   npm run seed
   ```

2. **Check category enum matches** in:
   - `server/src/models/Product.js`
   - `server/src/utils/categories.js`
   - Frontend filter component

### Issue: Cart Not Working

**Problem:** Items not adding to cart

**Solutions:**

1. **Login as buyer account** (not farmer)
2. **Check listing is active** (`isActive: true`)
3. **Check quantity available** in listing
4. **Clear existing cart** if from different seller:
   ```bash
   DELETE /api/cart
   ```

### Getting Help

If you encounter issues not covered here:

1. **Check the console logs** (browser and terminal)
2. **Verify all environment variables** are set correctly
3. **Ensure MongoDB is running** and accessible
4. **Check Node.js and npm versions** meet requirements
5. **Review GitHub Issues** for similar problems

---

## 🎨 Design System

### Color Palette

The application uses a carefully crafted 4-color palette inspired by nature and farming:

- **🌲 Forest Green** (`#2D5016`) - Primary color representing trust and nature
- **🧡 Warm Terracotta** (`#D17A4A`) - Secondary color for harvest and warmth
- **⭐ Golden Harvest** (`#F4B63F`) - Accent color representing freshness and energy
- **🤍 Soft Earth** (`#F7F5F2`) - Neutral background for calm and clean aesthetics

### Typography
- **Font**: System fonts (SF Pro, Segoe UI, Roboto)
- **Headings**: Bold, 700 weight
- **Body**: Regular, 400 weight

### Spacing
- Based on Tailwind's spacing scale (4px base unit)
- Consistent padding and margins throughout

---

## 📝 Environment Variables Reference

## 📝 Environment Variables Reference

### Backend (server/.env)

```env
# Server Configuration
PORT=5000                              # Server port (default: 5000)
NODE_ENV=development                   # Environment: development | production

# Database
MONGO_URI=mongodb://localhost:27017/farmer_marketplace   # MongoDB connection string
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/farmer_marketplace

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars   # JWT signing secret (CHANGE THIS!)

# CORS
CLIENT_ORIGIN=http://localhost:3000    # Frontend URL for CORS
```

### Frontend (client/.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api   # Backend API base URL
```

**Important Notes:**
- **Never commit** `.env` files to git (use `.env.example` instead)
- **Generate strong JWT_SECRET** for production:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Update CLIENT_ORIGIN** in production to match your deployed frontend URL

---

## 🚀 Deployment Guide

For complete deployment instructions to production, see the detailed guide in [README.md](README.md).

**Quick Deploy Stack:**
- **Frontend**: [Vercel](https://vercel.com) (Free tier, Next.js optimized)
- **Backend**: [Railway](https://railway.app) or [Render](https://render.com) (Free tier)
- **Database**: [MongoDB Atlas](https://mongodb.com/cloud/atlas) (Free M0 cluster)

**Estimated Time**: 30-45 minutes for first deployment

**See**: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) for step-by-step production deployment guide.

---

## 🤝 Contributing

This is an MVP project built for educational purposes. Contributions are welcome!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Test thoroughly before submitting PR
- Update documentation as needed
- Keep commits atomic and well-described

---

## 🔮 Future Enhancements

Planned features for future versions:

- [ ] **Payment Integration** - UPI, Cards, Wallets
- [ ] **Real-time Chat** - Socket.io for buyer-farmer communication
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **Product Recommendations** - ML-based suggestions
- [ ] **Inventory Management** - Auto-update quantities
- [ ] **Analytics Dashboard** - Sales insights for farmers
- [ ] **Email Notifications** - Order updates via email
- [ ] **Mobile App** - React Native version
- [ ] **Multi-language Support** - i18n for local languages
- [ ] **Delivery Tracking** - Real-time order tracking
- [ ] **Wishlist Feature** - Save favorite products
- [ ] **Bulk Orders** - Special pricing for bulk purchases

---

## 📄 License

MIT License

Copyright (c) 2026 FarmerMarket

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Modern e-commerce platforms
- **Icons**: [Lucide React](https://lucide.dev)
- **UI Components**: [Tailwind UI](https://tailwindui.com)
- **Images**: Demo data uses placeholder images
- **Community**: Built with ❤️ for farmers and conscious consumers

---

## 📞 Support

For questions, issues, or suggestions:

- **GitHub Issues**: [Report a bug](https://github.com/YOUR_USERNAME/farmer-marketplace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/farmer-marketplace/discussions)
- **Email**: your-email@example.com

---

## 📊 Project Stats

- **Lines of Code**: ~10,000+
- **Development Time**: MVP completed in iterations
- **Technologies**: 15+ libraries and frameworks
- **API Endpoints**: 25+ RESTful endpoints
- **Database Collections**: 6 MongoDB collections
- **Frontend Pages**: 8 main routes
- **Demo Data**: 16+ products, 4 users, sample orders

---

**Built with ❤️ for farmers and conscious consumers**

*Connecting local farms to your table, one click at a time.* 🌾

---

## 🎯 Quick Reference

### Common Commands

```bash
# Start development
cd server && npm run dev          # Terminal 1
cd client && npm run dev          # Terminal 2

# Seed database
cd server && npm run seed

# Production build
cd server && npm start
cd client && npm run build && npm start

# Install dependencies
npm install                       # In both server/ and client/

# Check for errors
npm audit                         # Security audit
```

### Quick Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **MongoDB**: mongodb://localhost:27017/farmer_marketplace

### Key Files to Know

- `server/server.js` - Backend entry point
- `server/src/models/` - Database schemas
- `client/app/page.js` - Landing page
- `client/lib/api.js` - API client
- `.gitignore` - Git exclusions
- `.env.example` - Environment template

---


*Last Updated: February 26, 2026*
