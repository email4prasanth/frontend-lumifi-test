import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Settings } from './Settings';

const mockStore = configureStore({
  reducer: {
    me: () => ({
      details: {
        role: 'admin',
      },
    }),
  },
});

vi.mock('@/lumifi/types/settings-types', () => ({
  getMenuItems: () => [
    {
      key: 'Profile',
      name: 'Profile Settings',
      link: '/settings/profile',
      icon: '/profile-icon.svg',
    },
    {
      key: 'Practice Info',
      name: 'Practice Info',
      link: '/settings/practice-info',
      icon: '/practice-icon.svg',
    },
  ],
}));

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    NavLink: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a
        href={to}
        {...props}
      >
        {children}
      </a>
    ),
  };
});

vi.mock('@/assets/images', () => ({
  chevronLeftIcon: 'chevronLeftIcon.svg',
  deleteIcon: 'deleteIcon.svg',
  lumifiLogo: 'lumifiLogo.svg',
  menuIcon: 'menuIcon.svg',
}));

vi.mock('@/lib/ui/components/image', () => ({
  Image: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  ),
}));

describe('Settings Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>
    );

  it('should render the Settings title', () => {
    renderComponent();
    expect(screen.getByTestId('settings-title')).toHaveTextContent('Settings');
  });

  it('should render sidebar navigation menu items based on role', () => {
    renderComponent();

    expect(screen.getByTestId('settings-nav-Profile')).toBeInTheDocument();
    expect(screen.getByTestId('settings-nav-Practice Info')).toBeInTheDocument();
  });

  it('should call navigate to delete account on click', () => {
    renderComponent();

    const deleteButton = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/settings/delete-account');
  });

  it('should toggle sidebar open/close in mobile view', () => {
    renderComponent();

    const menuButton = screen.getByTestId('mobile-menu-button');
    fireEvent.click(menuButton);
  });
});
