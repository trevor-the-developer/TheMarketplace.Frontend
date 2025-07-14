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
- **No URL Rewriting**: The `/api` prefix is preserved
- **Example**: `POST /api/auth/login` → `POST http://localhost:5212/api/auth/login`

### Current Implementation Status

- ✅ **Complete Authentication Flow**: Registration, email confirmation, and login working
- ✅ **Age Validation**: Registration requires users to be at least 13 years old
- ✅ **JWT Authentication**: Secure token-based authentication with refresh
- ✅ **Vuex Store**: State management for auth, listings, and cards
- ✅ **Vue Router**: Protected routes and navigation guards
- ✅ **Bootstrap Integration**: Responsive UI components
- ✅ **Axios Configuration**: HTTP client with token management and interceptors
- ✅ **Proxy Configuration**: CORS-free API communication
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Marketplace Features**: Basic listing display implemented

### Registration Process

1. **User Registration**: Fill out form with name, email, date of birth, and password
2. **Email Confirmation**: Click confirmation link to complete registration
3. **Login**: Use confirmed credentials to access protected features

### Development Notes

- The registration flow has been simplified to a single-step process with email confirmation
- All authentication endpoints are working correctly with proper error handling
- URL encoding for email confirmation tokens has been fixed

## API Integration

This frontend integrates with the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration with email confirmation
- `GET /api/auth/confirm-email` - Email confirmation
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Revoke JWT token

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/{id}` - Get specific listing

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/{id}` - Get specific card

### Other Resources
- `GET /api/products` - Get all products
- `GET /api/media` - Get media files
- `GET /api/user-profiles` - Get user profiles
