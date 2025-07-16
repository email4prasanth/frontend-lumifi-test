// CongratulationsStep.test.tsx
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { CongratulationsStep } from './CongratulationsStep';

// 🔁 Mock the t() function to return the key directly
vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => key,
}));

// ✅ Mock useNavigate from react-router-dom
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('CongratulationsStep', () => {
  afterEach(() => {
    cleanup();
    mockedNavigate.mockReset();
  });

  it('should render needsVerification messages', () => {
    const { getByTestId } = render(<CongratulationsStep needsVerification={true} />);

    expect(getByTestId('congratulations-title').textContent).toContain('createAcc.almostThere');
    expect(getByTestId('congratulations-subtitle').textContent).toContain('createAcc.needsVerification');
  });

  it('should render congratulations messages when verified', () => {
    const { getByTestId } = render(<CongratulationsStep needsVerification={false} />);

    expect(getByTestId('congratulations-title').textContent).toContain('createAcc.congratulations');
    expect(getByTestId('congratulations-subtitle').textContent).toContain('createAcc.verified');
  });

  it('should navigate to /login on button click', () => {
    const { getByTestId } = render(<CongratulationsStep needsVerification={false} />);
    fireEvent.click(getByTestId('lets-go-button'));

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
