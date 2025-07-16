import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LUMIFI_FOOTER_ITEMS } from '../types';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the footer logo', () => {
    render(<Footer />);
    const logo = screen.getByTestId('lumifi-logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders footer links container', () => {
    render(<Footer />);
    const linkContainer = screen.getByTestId('footer-links');
    expect(linkContainer).toBeInTheDocument();
  });

  it('renders all footer links with correct text and href', () => {
    render(<Footer />);
    LUMIFI_FOOTER_ITEMS.forEach((item) => {
      const link = screen.getByTestId(`footer-link-${item.key}`);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.link);
      expect(link).toHaveTextContent(item.name);
    });
  });

  it('renders correct number of dividers (|)', () => {
    render(<Footer />);
    const dividers = screen.getAllByTestId('footer-divider');
    expect(dividers.length).toBe(LUMIFI_FOOTER_ITEMS.length - 1);
  });
});
