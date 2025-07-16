import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from './Loader';

describe('Loader Component', () => {
  it('renders overlay loader by default', () => {
    render(<Loader />);

    expect(screen.getByTestId('loader-container')).toBeInTheDocument();
    expect(screen.getByTestId('loader-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loader-text')).toHaveTextContent('Loading...');
    expect(screen.queryByTestId('loader-inline-background')).not.toBeInTheDocument();
  });

  it('renders inline loader when overlay is false', () => {
    render(<Loader overlay={false} />);

    expect(screen.getByTestId('loader-container')).toBeInTheDocument();
    expect(screen.getByTestId('loader-inline-background')).toBeInTheDocument();
    expect(screen.getByTestId('loader-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loader-text')).toHaveTextContent('Loading...');
  });
});
