import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock useAuth to avoid relying on firebase in unit tests
vi.mock('../context/AuthContext.jsx', async () => {
  return {
    useAuth: () => ({ user: { email: 'test@example.com' }, logout: vi.fn() }),
  };
});

import Header from '../components/layout/Header.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import { BrowserRouter } from 'react-router-dom';

describe('Layout components', () => {
  test('Header renders menu button and calls toggle handler', () => {
    const onToggle = vi.fn();

    render(
      <BrowserRouter>
        <Header onToggleSidebar={onToggle} />
      </BrowserRouter>
    );

    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalled();
  });

  test('Sidebar shows mobile drawer when open and contains navigation', async () => {
    render(
      <BrowserRouter>
        <Sidebar isOpen={true} onClose={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByRole('dialog', { name: /main menu/i })).toBeInTheDocument();
    expect(screen.getByText(/menu/i)).toBeInTheDocument();
    // Close button should be focusable
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });
});
