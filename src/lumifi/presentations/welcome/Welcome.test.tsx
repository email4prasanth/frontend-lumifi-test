import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Welcome } from './Welcome';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderWelcome = () => {
  render(
    <BrowserRouter>
      <Welcome />
    </BrowserRouter>
  );
};

describe('Welcome Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main title and subtitle', () => {
    renderWelcome();
    expect(screen.getByTestId('welcome-title')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-subtitle')).toBeInTheDocument();
  });

  it('renders all steps with numbers and text', () => {
    renderWelcome();

    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`welcome-step-number-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`welcome-step-text-${i}`)).toBeInTheDocument();
    }
  });

  it('renders dental image', () => {
    renderWelcome();
    expect(screen.getByTestId('welcome-dental-image')).toBeInTheDocument();
  });

  it('calls navigate with /signup when get started button is clicked', () => {
    renderWelcome();
    fireEvent.click(screen.getByTestId('welcome-get-started-btn'));
    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });
});
