# 🏡 Homitly - Full Stack Airbnb Clone

A feature-rich, full-stack web application inspired by Airbnb, built with modern web technologies. Homitly allows users to list properties, book accommodations, leave reviews, and discover new places with an interactive map interface.

## 🌐 Live Demo

**[Visit Homitly](your-render-app-url-here)**

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login system using PassportJS
- Session management with express-session
- Role-based access control (users can only edit/delete their own content)
- Secure password hashing

### 🏠 Listing Management
- Create, read, update, and delete property listings
- Image upload for listings using Cloudinary and Multer
- Property details including address, coordinates, type, and amenities
- Search and filter functionality

### 🗺️ Interactive Maps
- Embedded maps using LeafletJS
- Precise location plotting with coordinates
- Interactive markers with property information popups
- Location-based property discovery

### ⭐ Review System
- Star-based rating system (1-5 stars)
- User-friendly star input with Starability CSS widget
- Text reviews with author information
- Permission-based review deletion

### 💖 Wishlist & Bookings
- Add/remove properties from personal wishlist
- Complete booking/reservation system
- Email confirmations using Nodemailer
- Booking management for users

### 📱 User Experience
- Fully responsive design for all devices
- Flash messaging for user actions
- Clean and intuitive user interface
- Comprehensive error handling

## 🛠️ Tech Stack

### Frontend
- **EJS** - Templating engine
- **HTML5 & CSS3** - Markup and styling
- **JavaScript** - Client-side functionality
- **LeafletJS** - Interactive maps
- **Starability** - Star rating widget

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **PassportJS** - Authentication middleware
- **passport-local** - Local authentication strategy
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### File Upload & Email
- **Cloudinary** - Cloud image storage
- **Multer** - File upload middleware
- **Nodemailer** - Email service

### Development & Deployment
- **dotenv** - Environment variable management
- **connect-flash** - Flash messaging
- **method-override** - HTTP method override
- **Joi** - Data validation
