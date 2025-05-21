# The Marketplace Frontend Implementation Summary

## Overview

This is a Vue.js-based frontend implementation for The Marketplace API. It provides a clean, responsive interface for users to interact with the application's core features.

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vuex 4** - State management pattern and library
- **Vue Router 4** - Official router for Vue.js
- **Axios** - Promise based HTTP client
- **Bootstrap 5** - CSS framework for responsive design
- **Vite** - Next generation frontend tooling

## Key Features

1. **Authentication System**
   - Complete JWT-based authentication flow
   - Two-step registration process with email confirmation
   - Token management with automatic refresh
   - Protected routes for authenticated users only

2. **Listings Management**
   - View all marketplace listings
   - Detailed view for individual listings
   - Display cards within listings

3. **Cards & Products**
   - View detailed card information
   - Color-coded cards based on card.colour property
   - Display products within cards
   - Show product details and status

## Architecture Highlights

- **Modular Store Design**: Separate Vuex modules for authentication, listings, and cards
- **Service Layer**: API communication is abstracted into service modules
- **Component Reusability**: Shared components for common UI elements
- **Responsive Design**: Mobile-friendly UI using Bootstrap

## How to Build and Run

1. **Installation**: Navigate to the frontend directory and install dependencies
   ```bash
   cd frontend
   npm install
   ```

2. **Development Server**: Start the development server
   ```bash
   npm run dev
   ```
   This will start the application at http://localhost:3000

3. **Building for Production**: Create a production build
   ```bash
   npm run build
   ```
   The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend integrates with The Marketplace API, which is expected to run at https://localhost:7220. The main API endpoints used are:

- Authentication endpoints (login, register, confirm email, etc.)
- Listing endpoints (get all listings, get specific listing)
- Card endpoints (get all cards, get specific card)

## Design Decisions

1. **Vue.js over React**
   - Vue's simplicity and gentle learning curve makes it perfect for an MVP
   - Component-based architecture aligns well with the domain model
   - Excellent documentation and ecosystem support

2. **Vuex for State Management**
   - Centralized store for authentication, listings, and cards data
   - Clear separation between API calls and UI components
   - Consistent error handling and loading states

3. **Bootstrap for UI**
   - Rapid development with pre-built components
   - Responsive design out of the box
   - Consistent styling across the application