import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NoAccess from './NoAccess';

// Mock navigate hook from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('NoAccess Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <NoAccess />
      </MemoryRouter>
    );

  it('renders the image correctly', () => {
    renderComponent();
    const image = screen.getByTestId('noaccess-img');
    expect(image).toBeInTheDocument();
  });

  it('renders the title correctly', () => {
    renderComponent();
    const title = screen.getByTestId('noaccess-title');
    expect(title).toBeInTheDocument();
  });

  it('renders the description correctly', () => {
    renderComponent();
    const description = screen.getByTestId('noaccess-description');
    expect(description).toBeInTheDocument();
  });

  it('renders the Go Back button and triggers navigate(-1)', () => {
    renderComponent();
    const backBtn = screen.getByTestId('noaccess-back');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders the Home button and triggers navigate("/home")', () => {
    renderComponent();
    const homeBtn = screen.getByTestId('noaccess-home');
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
