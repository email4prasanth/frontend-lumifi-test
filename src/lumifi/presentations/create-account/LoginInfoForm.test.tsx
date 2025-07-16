import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginInfoForm } from './LoginInfoForm';

const mockProps = {
  onNext: vi.fn(),
  initialEmail: 'test@example.com',
};

const component = (
  <MemoryRouter>
    <LoginInfoForm {...mockProps} />
  </MemoryRouter>
);

describe('LoginInfoForm', () => {
  it('should render all expected elements with data-testid attributes', async () => {
    const { getByTestId } = await act(async () => render(component));

    // Check for presence of main heading elements
    expect(getByTestId('login-title')).toBeInTheDocument();
    expect(getByTestId('login-subtitle')).toBeInTheDocument();
    expect(getByTestId('login-email')).toBeInTheDocument();
    expect(getByTestId('login-password')).toBeInTheDocument();
    expect(getByTestId('login-mobile-number')).toBeInTheDocument();

    // Check for presence of buttons
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  it('should disable next button when required fields are empty', () => {
    render(
      <MemoryRouter>
        <LoginInfoForm
          {...mockProps}
          initialEmail=''
        />
      </MemoryRouter>
    );

    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).toBeDisabled();
  });
});
