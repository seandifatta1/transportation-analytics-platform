import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';

// Mock AuthContext for Storybook
const MockAuthProvider = ({ children, user = null }) => {
  const mockAuthContext = {
    user: user,
    login: async (email, password) => {
      console.log('Mock login called with:', email, password);
    },
    logout: async () => {
      console.log('Mock logout called');
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  );
};

const Wrapper = ({ children, user = null }) => (
  <BrowserRouter>
    <MockAuthProvider user={user}>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        {children}
      </div>
    </MockAuthProvider>
  </BrowserRouter>
);

export default {
  title: 'Components/LogoutButton',
  component: LogoutButton,
  decorators: [(Story, { args }) => <Wrapper user={args.user}><Story /></Wrapper>],
};

export const Default = {
  args: {
    user: { id: '1', name: 'John Doe', email: 'john@example.com' }
  },
  render: (args) => <LogoutButton {...args} />
};

export const NoUser = {
  args: {
    user: null
  },
  render: (args) => <LogoutButton {...args} />
};

export const InAppBar = {
  args: {
    user: { id: '1', name: 'John Doe', email: 'john@example.com' }
  },
  render: (args) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#1976d2',
      color: 'white'
    }}>
      <span>Transportation Analytics Platform</span>
      <LogoutButton {...args} />
    </div>
  )
};
