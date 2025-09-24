# Authentication Migration Guide

This document outlines the migration from Firebase Auth to JWT-based authentication system.

## Overview

The Transportation Analytics Platform has been migrated from Firebase Auth to a custom JWT-based authentication system using MySQL as the backend database.

## Changes Made

### 1. Backend Authentication (Already Completed)
- **JWT Implementation**: Custom JWT authentication with `jsonwebtoken` library
- **Password Hashing**: Using `bcryptjs` for secure password storage
- **Database Integration**: User authentication stored in MySQL database
- **Session Management**: JWT tokens with refresh capabilities

### 2. Frontend Authentication (New)

#### **New Services**
- **`authService.js`**: Centralized authentication service
  - Login/logout functionality
  - Token management
  - Session validation
  - Automatic token refresh
  - Axios interceptors for automatic token inclusion

#### **New Context**
- **`AuthContext.js`**: React context for authentication state
  - Global authentication state management
  - User information storage
  - Loading states
  - Authentication methods (login, register, logout)

#### **New Components**
- **`ProtectedRoute.js`**: Route protection component
  - Redirects unauthenticated users to login
  - Loading states during authentication check
  - Preserves intended destination after login

- **`LogoutButton.js`**: User menu component
  - User avatar display
  - Profile/settings menu
  - Logout functionality

#### **Updated Components**
- **`Login.js`**: Updated login and registration forms
  - JWT-based authentication
  - Error handling and loading states
  - Form validation
  - Automatic redirect after successful authentication

- **`App.js`**: Updated routing
  - AuthProvider wrapper
  - Protected routes
  - Multiple login/signup paths for compatibility

- **`GlobalComponents.js`**: Updated data loading
  - Uses user ID from auth context instead of cookies
  - Automatic data refresh when user changes

## API Endpoints

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/validate` - Validate current session
- `POST /auth/refresh` - Refresh JWT token

### Request/Response Format

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

## Environment Variables

### Frontend (.env)
```env
REACT_APP_BASE_URL=http://localhost:3001
NODE_ENV=development
REACT_APP_DEBUG=true
```

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=transportation_analytics
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
```

## Migration Steps

### 1. Database Setup
```bash
# Start MySQL server
# Create database and run migrations
cd server
npm run init-db
```

### 2. Backend Setup
```bash
cd server
npm install
npm run start:mysql
```

### 3. Frontend Setup
```bash
cd client
npm install
# Copy env.example to .env and configure
cp env.example .env
npm start
```

## Features

### Security Features
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Token Expiration**: Configurable token lifetime
- **Refresh Tokens**: Automatic token refresh
- **CORS Protection**: Proper CORS configuration

### User Experience Features
- **Persistent Login**: Remember user across browser sessions
- **Automatic Redirect**: Return to intended page after login
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for failed authentication
- **Form Validation**: Client-side validation for better UX

### Developer Experience Features
- **Type Safety**: TypeScript-ready authentication service
- **Centralized State**: Single source of truth for auth state
- **Automatic Token Management**: No manual token handling required
- **Interceptors**: Automatic token inclusion in API requests
- **Error Boundaries**: Graceful handling of auth errors

## Testing

### Manual Testing
1. **Registration**: Create new account
2. **Login**: Sign in with existing account
3. **Protected Routes**: Access dashboard without login (should redirect)
4. **Logout**: Sign out and verify redirect to login
5. **Token Refresh**: Verify automatic token refresh
6. **Session Persistence**: Close browser and reopen (should stay logged in)

### API Testing
```bash
# Test login endpoint
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:3001/users/1/vehicles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend URL
   - Check REACT_APP_BASE_URL matches backend URL

2. **Token Expiration**
   - Check JWT_SECRET is set in backend
   - Verify token expiration time configuration

3. **Database Connection**
   - Ensure MySQL is running
   - Check database credentials in .env
   - Run database initialization script

4. **Authentication Failures**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check network tab for failed requests

### Debug Mode
Set `REACT_APP_DEBUG=true` in frontend .env to enable detailed logging.

## Security Considerations

1. **JWT Secret**: Use a strong, random JWT secret in production
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)
4. **Password Policy**: Implement strong password requirements
5. **Rate Limiting**: Consider implementing rate limiting for auth endpoints

## Future Enhancements

1. **Two-Factor Authentication**: Add 2FA support
2. **Social Login**: Integrate with Google/Microsoft OAuth
3. **Password Reset**: Implement password reset functionality
4. **Account Verification**: Email verification for new accounts
5. **Role-Based Access**: Implement user roles and permissions
6. **Audit Logging**: Track authentication events
7. **Session Management**: Admin panel for managing user sessions

## Rollback Plan

If issues arise, the system can be rolled back to Firebase Auth by:
1. Reverting frontend authentication components
2. Restoring Firebase configuration
3. Updating API calls to use Firebase tokens
4. Reverting database changes

However, this would require significant rework and is not recommended unless critical issues are encountered.
