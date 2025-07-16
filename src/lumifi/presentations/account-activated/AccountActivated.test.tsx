import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountActivated } from './AccountActivated';

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
      'accountActive.title': 'Your Account is Active!',
      'accountActive.message': 'Welcome! You can now log in and get started.',
      'common.letsGo': "Let's Go",
    };
    return translations[key] || key;
  },
}));

describe('AccountActivated Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should render the image, title, message and button', () => {
    render(<AccountActivated />, { wrapper: MemoryRouter });

    expect(screen.getByText('Your Account is Active!')).toBeInTheDocument();
    expect(screen.getByTestId('login-subtitle')).toHaveTextContent('Welcome! You can now log in and get started.');

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Let's Go");
  });

  it('should navigate to /login when button is clicked', () => {
    render(<AccountActivated />, { wrapper: MemoryRouter });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
