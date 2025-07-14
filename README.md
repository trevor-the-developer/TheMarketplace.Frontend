# The Marketplace Frontend

This is a Vue.js frontend for The Marketplace API.

## Dependencies

**Important**: This frontend application depends on the backend API to function properly. You must have [The Marketplace](https://github.com/trevor-the-developer/TheMarketplace) .NET project running locally.

- **Backend Repository**: https://github.com/trevor-the-developer/TheMarketplace
- **Expected Backend Port**: 5212 (configured in Vite proxy)
- **Backend API Documentation**: Available at `http://localhost:5212/swagger` when running

## Features

- User authentication (login, registration, token management)
- Viewing marketplace listings
- Viewing cards within listings
- Detailed product information

## Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable Vue components
├── services/            # API services
├── store/               # Vuex store modules
│   └── modules/         # Store modules for authentication, listings, cards
├── utils/               # Utility functions
├── views/               # Page components
├── App.vue              # Root component
├── main.js              # Application entry point
└── router/              # Vue Router configuration
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- The Marketplace API running on port 5212 (see backend dependency above)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technical Details

### Proxy Configuration

The development server uses Vite's proxy feature to forward API requests to the backend:

- **Frontend URL**: `http://localhost:3000`
- **API Proxy**: All requests to `/api/*` are forwarded to `http://localhost:5212`
- **URL Rewriting**: The `/api` prefix is removed when forwarding to the backend
- **Example**: `POST /api/auth/login` → `POST http://localhost:5212/auth/login`

### Current Implementation Status

- ✅ **Authentication Flow**: Login, registration, email confirmation, token refresh
- ✅ **Vuex Store**: State management for auth, listings, and cards
- ✅ **Vue Router**: Protected routes and navigation
- ✅ **Bootstrap Integration**: Responsive UI components
- ✅ **Axios Configuration**: HTTP client with token management
- ✅ **Proxy Configuration**: CORS-free API communication
- ⚠️ **Registration Step Two**: Backend endpoint requires debugging
- 🔄 **Marketplace Features**: Basic listing display implemented

### Known Issues

- Registration step two (email confirmation completion) currently returns 400 error from backend
- This blocks completing user registration and login testing

## API Integration

This frontend integrates with the following API endpoints:

- Authentication
  - `/api/login/` - User login
  - `/api/register/` - User registration (step one)
  - `/api/confirm_email/` - Email confirmation
  - `/api/register/step-two` - Complete registration
  - `/api/refresh/` - Refresh JWT token
  - `/api/logout/` - Revoke JWT token

- Listings
  - `/api/get/listing/` - Get all listings
  - `/api/get/listing/{id}` - Get specific listing

- Cards
  - `/api/get/cards/` - Get all cards
  - `/api/get/card/{id}` - Get specific card