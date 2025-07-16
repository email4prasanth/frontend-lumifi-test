import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderHeader = () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header and logo', () => {
    renderHeader();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('header-logo')).toBeInTheDocument();
  });

  it('navigates to home page when logo is clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByTestId('header-logo-wrapper'));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
