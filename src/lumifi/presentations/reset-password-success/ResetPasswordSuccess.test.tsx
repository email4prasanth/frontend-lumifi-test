import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';

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
      'resetPassword.successMessage': 'Your password has been successfully reset!',
      'common.proceedToLogin': 'Proceed to Login',
    };
    return translations[key] || key;
  },
}));

describe('ResetPasswordSuccess Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should display reset password success message and proceed button', () => {
    render(<ResetPasswordSuccess />, { wrapper: MemoryRouter });

    const message = screen.getByTestId('reset-success-message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Your password has been successfully reset!');

    const button = screen.getByTestId('proceed-to-login-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Proceed to Login');
  });

  it('should navigate to /login on button click', () => {
    render(<ResetPasswordSuccess />, { wrapper: MemoryRouter });

    const button = screen.getByTestId('proceed-to-login-button');
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
