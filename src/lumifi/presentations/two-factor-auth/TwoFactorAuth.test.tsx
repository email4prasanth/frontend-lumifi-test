import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwoFactorAuthForm } from './TwoFactorAuth';

const store = configureStore({
  reducer: {
    userAuth: () => ({
      loginId: '123',
      userId: '456',
      emailId: 'test@example.com',
    }),
  },
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => {
    const translations: Record<string, string> = {
      'twoFactorAuth.errors.match': 'Code must be 6 digits',
      'twoFactorAuth.errors.required': 'Code is required',
      'twoFactorAuth.title': 'Two Factor Authentication',
      'twoFactorAuth.subtitle': 'A code was sent to',
      'twoFactorAuth.code.label': 'Authentication Code',
      'twoFactorAuth.code.placeholder': 'Enter 6-digit code',
      'twoFactorAuth.helperText': 'Check your email for the code',
      'common.resend': 'Resend',
      'common.login': 'Login',
    };
    return translations[key] || key;
  },
}));

const verifyOtpMock = vi.fn();
const resendOtpMock = vi.fn();

vi.mock('@/lumifi/hooks', () => ({
  useUserLogin: () => ({
    isTwoFaLoading: false,
    isResendOtpLoading: false,
    VerifyOtp: verifyOtpMock,
    resendOtp: resendOtpMock,
  }),
}));

describe('TwoFactorAuthForm', () => {
  beforeEach(() => {
    verifyOtpMock.mockClear();
    resendOtpMock.mockClear();
    mockNavigate.mockClear();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TwoFactorAuthForm />
        </MemoryRouter>
      </Provider>
    );

  it('renders the form and input field correctly', () => {
    renderComponent();

    expect(screen.getByTestId('2fa-form')).toBeInTheDocument();
    expect(screen.getByTestId('2fa-code-input')).toBeInTheDocument();
    expect(screen.getByTestId('resend-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  // it('shows validation error for invalid code', async () => {
  //   renderComponent();

  //   const input = screen.getByTestId('2fa-code-input').querySelector('input')!;
  //   fireEvent.change(input, { target: { value: '123' } });

  //   const submitBtn = screen.getByTestId('submit-button');
  //   fireEvent.click(submitBtn);

  //   await waitFor(() => {
  //     expect(screen.getByText('Code must be 6 digits')).toBeInTheDocument();
  //   });
  // });

  // it('calls VerifyOtp on valid form submission', async () => {
  //   renderComponent();

  //   const input = screen.getByTestId('2fa-code-input').querySelector('input')!;
  //   fireEvent.change(input, { target: { value: '123456' } });

  //   const submitBtn = screen.getByTestId('submit-button');
  //   fireEvent.click(submitBtn);

  //   await waitFor(() => {
  //     expect(verifyOtpMock).toHaveBeenCalledWith(
  //       { loginId: '123', userId: '456', otp: '123456' },
  //       expect.any(Function)
  //     );
  //   });
  // });

  // it('calls resendOtp when resend button is clicked', () => {
  //   renderComponent();

  //   const resendBtn = screen.getByTestId('resend-button');
  //   fireEvent.click(resendBtn);

  //   expect(resendOtpMock).toHaveBeenCalledWith({
  //     loginId: '123',
  //     userId: '456',
  //   });
  // });
});
