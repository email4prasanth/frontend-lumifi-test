import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NotFound from './NotFound';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderNotFound = () => {
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  );
};

describe('NotFound Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders image, title, and description', () => {
    renderNotFound();

    expect(screen.getByTestId('notfound-image')).toBeInTheDocument();
    expect(screen.getByTestId('notfound-title')).toBeInTheDocument();
    expect(screen.getByTestId('notfound-description')).toBeInTheDocument();
  });

  it('renders both buttons', () => {
    renderNotFound();

    expect(screen.getByTestId('notfound-go-back')).toBeInTheDocument();
    expect(screen.getByTestId('notfound-home-page')).toBeInTheDocument();
  });

  it('navigates back when "Go Back" button is clicked', () => {
    renderNotFound();

    fireEvent.click(screen.getByTestId('notfound-go-back'));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it('navigates to homepage when "Home Page" button is clicked', () => {
    renderNotFound();

    fireEvent.click(screen.getByTestId('notfound-home-page'));
    expect(mockedNavigate).toHaveBeenCalledWith('/home');
  });
});
