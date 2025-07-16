import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReactivateAccount } from './ReactivateAccount';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => {
    const translations: Record<string, string> = {
      'reactivateAccount.title': 'Your account will be reactivated on',
      'reactivateAccount.message': 'We’re preparing your dashboard. Please wait...',
      'common.reactivateAccount': 'Reactivate Account',
    };
    return translations[key] || key;
  },
}));

describe('ReactivateAccount Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should render title, message, and button', () => {
    render(<ReactivateAccount />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Your account will be reactivated on/i)).toBeInTheDocument();
    expect(screen.getByText(/05\/25\/2025/)).toBeInTheDocument();

    const subtitle = screen.getByTestId('login-subtitle');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('We’re preparing your dashboard. Please wait...');

    const button = screen.getByRole('button', { name: /Reactivate Account/i });
    expect(button).toBeInTheDocument();
  });

  it('should navigate to /account-activated on button click', () => {
    render(<ReactivateAccount />, { wrapper: MemoryRouter });

    const button = screen.getByRole('button', { name: /Reactivate Account/i });
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith('/account-activated', { replace: true });
  });
});
