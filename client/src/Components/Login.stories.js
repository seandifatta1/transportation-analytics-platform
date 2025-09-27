import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Login, SignUp } from './Login';

// Mock AuthContext for Storybook
const MockAuthProvider = ({ children }) => {
  const mockAuthContext = {
    user: null,
    login: async (email, password) => {
      console.log('Mock login called with:', email, password);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email === 'test@example.com' && password === 'password') {
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    },
    logout: () => {
      console.log('Mock logout called');
    }
  };

  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  );
};

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <MockAuthProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {children}
      </div>
    </MockAuthProvider>
  </BrowserRouter>
);

export default {
  title: 'Components/Login',
  component: Login,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
};

export const Default = {
  render: () => <Login />,
};

export const SignUpForm = {
  render: () => <SignUp />,
};

export const WithError = {
  render: () => {
    // This would show an error state - you'd need to modify the component to accept error props
    return <Login />;
  },
};
