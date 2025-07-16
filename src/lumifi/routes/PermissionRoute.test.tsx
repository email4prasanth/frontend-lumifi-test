import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PermissionRoute } from './PermissionRoute';

// Mock getAccess
vi.mock('../types', () => ({
  getAccess: vi.fn(),
}));

import { getAccess } from '../types';

const ProtectedContent = () => <div data-testid='protected'>Protected Content</div>;
const NoAccessPage = () => <div data-testid='no-access'>No Access</div>;

describe('PermissionRoute', () => {
  const renderWithStore = ({ role, route, reduxRole }: { role?: string; route: string; reduxRole?: string }) => {
    const mockStore = configureStore({
      reducer: {
        me: () => ({
          details: { role: reduxRole },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path={route}
              element={
                <PermissionRoute
                  role={role}
                  route={route}
                >
                  <ProtectedContent />
                </PermissionRoute>
              }
            />
            <Route
              path='/no-access'
              element={<NoAccessPage />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children if access is granted via prop role', () => {
    vi.mocked(getAccess).mockReturnValue(true);
    renderWithStore({ role: 'admin', route: '/settings' });
    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(getAccess).toHaveBeenCalledWith('admin', '/settings');
  });

  it('renders children if access is granted via redux role fallback', () => {
    vi.mocked(getAccess).mockReturnValue(true);
    renderWithStore({ route: '/dashboard', reduxRole: 'user' });
    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(getAccess).toHaveBeenCalledWith('user', '/dashboard');
  });

  it('redirects to /no-access if access is denied', () => {
    vi.mocked(getAccess).mockReturnValue(false);
    renderWithStore({ route: '/admin', reduxRole: 'guest' });
    expect(screen.getByTestId('no-access')).toBeInTheDocument();
    expect(getAccess).toHaveBeenCalledWith('guest', '/admin');
  });
});
