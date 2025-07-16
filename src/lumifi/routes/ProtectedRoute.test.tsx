import { clearUser } from '@/store/slices';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';

const TestComponent = () => <div data-testid='protected-content'>Protected Content</div>;

vi.mock('@/store/slices', async () => {
  const actual = await vi.importActual('@/store/slices');
  return {
    ...actual,
    clearUser: vi.fn(() => ({ type: 'auth/clearUser' })),
  };
});

describe('ProtectedRoute', () => {
  const renderWithStore = (isAuthenticated: boolean) => {
    const store = configureStore({
      reducer: {
        auth: (state = { isAuthenticated }, action) => {
          switch (action.type) {
            case 'auth/clearUser':
              return { isAuthenticated: false };
            default:
              return state;
          }
        },
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                path='/protected'
                element={<TestComponent />}
              />
            </Route>
            <Route
              path='/login'
              element={<div data-testid='login-page'>Login Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('redirects to login if user is not authenticated', async () => {
    renderWithStore(false);
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  it('renders protected content if user is authenticated and auth is persisted', async () => {
    localStorage.setItem('persist:root', 'some-persisted-auth');
    renderWithStore(true);
    expect(await screen.findByTestId('protected-content')).toBeInTheDocument();
  });

  it('calls clearUser if user is authenticated but localStorage is missing', async () => {
    renderWithStore(true);
    await waitFor(() => {
      expect(clearUser).toHaveBeenCalled();
    });
  });

  it('removes event listener on unmount', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderWithStore(true);
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
  });
});
