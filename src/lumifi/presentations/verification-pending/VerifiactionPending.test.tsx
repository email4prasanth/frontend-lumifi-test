import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VerifiactionPending } from './VerifiactionPending';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useParams: vi.fn(() => ({ account: 'PA' })),
  };
});

vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => {
    const translations: Record<string, string> = {
      'accountPending.paTitle': 'PA Account Verification Pending',
      'accountPending.uaTitle': 'UA Account Verification Pending',
      'accountPending.title': 'Account Verification Pending',
      'accountPending.message': 'We’re reviewing your account information.',
      'common.login': 'Login',
      'common.contactSupport': 'Contact Support',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/assets/images', () => ({
  arrowRightIcon: 'arrowRightIcon.svg',
  dentalImageRight: 'dentalImageRight.svg',
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

describe('VerifiactionPending Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/verify/PA']}>
        <Routes>
          <Route
            path='/verify/:account'
            element={<VerifiactionPending />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders correct PA account title and message', () => {
    renderComponent();

    expect(screen.getByTestId('verification-title')).toHaveTextContent('PA Account Verification Pending');

    expect(screen.getByTestId('login-subtitle')).toHaveTextContent('We’re reviewing your account information.');
  });

  it('navigates to /login when login button is clicked', () => {
    renderComponent();

    const loginBtn = screen.getByTestId('login-button');
    fireEvent.click(loginBtn);

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('opens contact support link in a new tab when button is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderComponent();

    const contactBtn = screen.getByTestId('contact-support-button');
    fireEvent.click(contactBtn);

    expect(openSpy).toHaveBeenCalledWith('https://lumifidental.com/contact/', '_blank', 'noopener,noreferrer');

    openSpy.mockRestore();
  });
});
