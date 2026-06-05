import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

// Mock axios — no real API calls during tests
vi.mock('../api/axios', () => ({
  default: { post: vi.fn() }
}));

// Helper to render Login with all required providers
const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={{
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        loading: false
      }}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {

  test('renders the login form', () => {
    renderLogin();
    // Matches the actual h1 text in Login.tsx
    expect(screen.getByText('Login to ExpenseTrack')).toBeInTheDocument();
  });

  test('renders email input', () => {
    renderLogin();
    // Login.tsx uses placeholder="Email"
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('renders password input', () => {
    renderLogin();
    // Login.tsx uses placeholder="Password" — no label element, so use placeholder
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('renders sign in button', () => {
    renderLogin();
    // Login.tsx button text is "Submit"
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('renders link to register page', () => {
    renderLogin();
    expect(screen.getByText(/create one/i)).toBeInTheDocument();
  });
});