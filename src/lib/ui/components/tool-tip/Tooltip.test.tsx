import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Tooltip from './Tooltip'; // adjust import path

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip text='Short tooltip'>
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('does not show tooltip by default', () => {
    render(
      <Tooltip text='Hidden tooltip'>
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Hidden tooltip');
    expect(tooltip).toHaveClass('opacity-0');
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip text='Visible tooltip'>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);

    const tooltip = screen.getByText('Visible tooltip');
    expect(tooltip).toHaveClass('group-hover:opacity-100');
  });

  it('applies long text classes when text exceeds 20 characters', () => {
    const longText = 'This is a tooltip with a long description that should wrap.';
    render(
      <Tooltip text={longText}>
        <span>Info</span>
      </Tooltip>
    );

    const tooltip = screen.getByText(/This is a tooltip/);
    expect(tooltip).toHaveClass('break-words whitespace-normal');
  });

  it('applies short text class when text is 20 characters or less', () => {
    render(
      <Tooltip text='Short tooltip'>
        <span>Info</span>
      </Tooltip>
    );

    const tooltip = screen.getByText('Short tooltip');
    expect(tooltip).toHaveClass('whitespace-nowrap');
  });
});
