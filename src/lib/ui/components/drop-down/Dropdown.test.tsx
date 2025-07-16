import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from './Dropdown';

const options = [
  { label: 'Option One', value: '1' },
  { label: 'Option Two', value: '2' },
];

describe('Dropdown Component', () => {
  it('should render placeholder initially', () => {
    render(
      <Dropdown
        options={options}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  it('should open and close menu when toggled', () => {
    render(
      <Dropdown
        options={options}
        onSelect={vi.fn()}
      />
    );

    const toggleButton = screen.getByTestId('dropdown-toggle');

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('dropdown-option-0')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('dropdown-option-0')).not.toBeInTheDocument();
  });

  it('should show all options in dropdown', () => {
    render(
      <Dropdown
        options={options}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('dropdown-toggle'));

    expect(screen.getByTestId('dropdown-option-0')).toHaveTextContent('Option One');
    expect(screen.getByTestId('dropdown-option-1')).toHaveTextContent('Option Two');
  });

  it('should call onSelect with correct value', () => {
    const mockSelect = vi.fn();
    render(
      <Dropdown
        options={options}
        onSelect={mockSelect}
      />
    );

    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    fireEvent.click(screen.getByTestId('dropdown-option-1'));

    expect(mockSelect).toHaveBeenCalledWith(options[1]);
    expect(screen.queryByTestId('dropdown-option-1')).not.toBeInTheDocument();
  });

  it('should show fallback when no options are provided', () => {
    render(
      <Dropdown
        options={[]}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    expect(screen.getByTestId('dropdown-no-options')).toHaveTextContent('No options available');
  });

  it('should display selectedOption when provided', () => {
    render(
      <Dropdown
        options={options}
        selectedOption={options[0]}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Option One')).toBeInTheDocument();
  });
});
