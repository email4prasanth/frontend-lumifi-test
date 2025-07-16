import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TermsAgreement } from './TermsAgreement';
import { MemoryRouter } from 'react-router-dom';

// Mock the assets and translations
vi.mock('@/assets/images', () => ({
  arrowRightIcon: 'arrow-right-icon',
  closeIcon: 'close-icon',
}));

vi.mock('@/lib/utils', () => ({
  t: (namespace: string, key: string) => `${namespace}.${key}`,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TermsAgreement Component', () => {
  const mockOnFinish = vi.fn();
  const mockOnAgreementChange = vi.fn();
  const defaultProps = {
    onFinish: mockOnFinish,
    termsAndConditions: {
      agreed: false,
    },
    onAgreementChange: mockOnAgreementChange,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <TermsAgreement
          {...defaultProps}
          {...props}
        />
      </MemoryRouter>
    );
  };

  it('renders the component with all elements', () => {
    renderComponent();

    // Check title and subtitle
    expect(screen.getByTestId('terms-title')).toHaveTextContent('lumifi.termsInfo.title');
    expect(screen.getByTestId('terms-subtitle')).toHaveTextContent('lumifi.termsInfo.subtitle');

    // Check checkbox and label
    expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('terms-label')).toBeInTheDocument();

    // Check links
    expect(screen.getByTestId('terms-link')).toHaveAttribute('href', '/terms');
    expect(screen.getByTestId('policy-link')).toHaveAttribute('href', '/policy');

    // Check buttons
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('finish-button')).toBeInTheDocument();
  });

  it('initializes checkbox state based on props', () => {
    renderComponent({
      termsAndConditions: {
        agreed: true,
      },
    });
    expect(screen.getByTestId('terms-checkbox')).toBeChecked();
  });

  it('toggles checkbox state when clicked', () => {
    renderComponent();
    const checkbox = screen.getByTestId('terms-checkbox');

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(mockOnAgreementChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(mockOnAgreementChange).toHaveBeenCalledWith(false);
  });

  it('disables finish button when checkbox is not checked', () => {
    renderComponent();
    expect(screen.getByTestId('finish-button')).toBeDisabled();
  });

  it('enables finish button when checkbox is checked', () => {
    renderComponent({
      termsAndConditions: {
        agreed: true,
      },
    });
    expect(screen.getByTestId('finish-button')).not.toBeDisabled();
  });

  it('calls onFinish when finish button is clicked and checkbox is checked', async () => {
    renderComponent({
      termsAndConditions: {
        agreed: true,
      },
    });

    fireEvent.click(screen.getByTestId('finish-button'));
    await waitFor(() => {
      expect(mockOnFinish).toHaveBeenCalled();
    });
  });

  it('does not call onFinish when finish button is clicked and checkbox is not checked', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('finish-button'));
    expect(mockOnFinish).not.toHaveBeenCalled();
  });

  it('navigates to login when cancel button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('cancel-button'));
  });
});
