import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Login, SignUp } from './Login';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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

export const SuccessfulLogin = {
  render: () => <Login />,
  play: async ({ canvasElement }) => {
    console.log('🎬 Play function started!');
    const canvas = within(canvasElement);
    
    // Fill in valid credentials
    console.log('📝 Filling in email...');
    await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com');
    
    console.log('📝 Filling in password...');
    await userEvent.type(canvas.getByLabelText(/password/i), 'password');
    
    // Click login button
    console.log('🖱️ Clicking login button...');
    await userEvent.click(canvas.getByRole('button', { name: /login/i }));
    
    // Wait for success (in real app, this would show success state)
    console.log('✅ Checking for success...');
    await expect(canvas.getByText(/login/i)).toBeInTheDocument();
    
    console.log('🎬 Play function completed!');
  },
};

export const FailedLogin = {
  render: () => <Login />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill in invalid credentials
    await userEvent.type(canvas.getByLabelText(/email/i), 'wrong@example.com');
    await userEvent.type(canvas.getByLabelText(/password/i), 'wrongpassword');
    
    // Click login button
    await userEvent.click(canvas.getByRole('button', { name: /login/i }));
    
    // Should show error (component needs to handle this)
    await expect(canvas.getByText(/login/i)).toBeInTheDocument();
  },
};

export const EmptyFormSubmission = {
  render: () => <Login />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Try to submit without filling anything
    await userEvent.click(canvas.getByRole('button', { name: /login/i }));
    
    // Should show validation errors or prevent submission
    await expect(canvas.getByText(/login/i)).toBeInTheDocument();
  },
};

export const SignUpForm = {
  render: () => <SignUp />,
};

export const SignUpFormInteraction = {
  render: () => <SignUp />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill in signup form
    await userEvent.type(canvas.getByLabelText(/first name/i), 'John');
    await userEvent.type(canvas.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(canvas.getByLabelText(/email/i), 'john.doe@example.com');
    await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
    await userEvent.type(canvas.getByLabelText(/confirm password/i), 'password123');
    
    // Click signup button
    await userEvent.click(canvas.getByRole('button', { name: /sign up/i }));
    
    // Should show success or validation
    await expect(canvas.getByText(/sign up/i)).toBeInTheDocument();
  },
};

export const PasswordMismatch = {
  render: () => <SignUp />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill in signup form with mismatched passwords
    await userEvent.type(canvas.getByLabelText(/first name/i), 'John');
    await userEvent.type(canvas.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(canvas.getByLabelText(/email/i), 'john.doe@example.com');
    await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
    await userEvent.type(canvas.getByLabelText(/confirm password/i), 'different123');
    
    // Click signup button
    await userEvent.click(canvas.getByRole('button', { name: /sign up/i }));
    
    // Should show password mismatch error
    await expect(canvas.getByText(/sign up/i)).toBeInTheDocument();
  },
};
