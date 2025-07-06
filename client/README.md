# Barcode Inventory Management - Frontend

A React-based frontend for the Barcode Inventory Management System, built with Vite, Tailwind CSS, and React Router DOM.

## Features

- 🔐 **JWT Authentication** - Secure login and registration with token persistence
- 🛡️ **Protected Routes** - Automatic redirection for unauthenticated users
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎯 **React Router v6** - Modern routing with nested routes
- 🔄 **Context API** - Global state management for authentication
- 📊 **Analytics Dashboard** - Placeholder for inventory analytics
- 🔍 **Product Search** - Search functionality with multiple filters
- 🏠 **Dashboard Home** - Overview and quick actions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **ESLint** - Code linting

## Project Structure

```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── Analytics.jsx
│   │   └── Search.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .eslintrc.cjs
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the backend API at:
`https://barcode-inventory-management.onrender.com/api`

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Routes

All API calls to protected endpoints automatically include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Features Overview

### Authentication
- User registration with name, email, and password
- User login with email and password
- JWT token storage in localStorage
- Automatic token inclusion in API requests
- Protected route redirection

### Navigation
- Responsive navbar with app branding
- Navigation links to Home, Analytics, and Search
- User welcome message
- Logout functionality

### Pages
- **Login** - Authentication form with error handling
- **Register** - User registration with validation
- **Home** - Dashboard overview with quick actions
- **Analytics** - Inventory analytics dashboard (placeholder)
- **Search** - Product search with multiple filters (placeholder)

## Styling

The project uses Tailwind CSS with custom components:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.input-field` - Form input styling
- `.card` - Card container styling

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Add navigation link to `src/components/Navbar.jsx` if needed

### Adding New Components

1. Create the component in `src/components/`
2. Import and use in the appropriate page

### API Integration

1. Use the `useAuth` hook to access authentication state
2. Use axios for API calls (already configured with auth headers)
3. Handle loading states and errors appropriately

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables

Create a `.env` file in the client directory for any environment-specific configuration:

```env
VITE_API_URL=https://barcode-inventory-management.onrender.com/api
```

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Follow Tailwind CSS conventions
4. Add proper error handling
5. Test authentication flows

## License

This project is part of the Barcode Inventory Management System. 