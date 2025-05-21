# The Marketplace Frontend

This is a Vue.js frontend for The Marketplace API.

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
- The Marketplace API running (on default port: 7220)

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