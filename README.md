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

- ✅ **Complete Authentication Flow**: Seamless registration, email confirmation, and login
- ✅ **Email Confirmation**: Proper routing to frontend URLs
- ✅ **Age Validation**: Users must be at least 13 years old to register
- ✅ **JWT Authentication**: Secure token authentication with automatic refresh
- ✅ **Proxy Setup**: CORS-free communication via Vite proxy
- ✅ **Vuex Store**: Centralized state management
- ✅ **Vue Router**: Navigation guards and protected routes
- ✅ **Bootstrap Integration**: Responsive and accessible design
- ✅ **Axios Configuration**: Token management with interceptors
- ✅ **Error Handling**: Comprehensive user feedback
- ✅ **Marketplace Listings**: Basic listing functionality

### Recent Improvements

- **Registration and Email**: Improved registration flow with single-step user confirmation
- **MailHog Integration**: Enhanced email testing with correct frontend URLs
- **Configuration Management**: Centralized frontend URL configuration

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
