import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Stepper } from './Stepper';

// Mock the Image component and assets
vi.mock('@/lib/ui/components/image', () => ({
  Image: ({ src, alt, className }: { src: string; alt: string; className: string }) => (
    <img
      data-testid='mock-image'
      src={src}
      alt={alt}
      className={className}
    />
  ),
}));

vi.mock('@/assets/images', () => ({
  tickIcon: 'tick-icon-path',
}));

describe('Stepper Component', () => {
  const mockSteps = [
    { id: 1, label: 'Step 1' },
    { id: 2, label: 'Step 2' },
    { id: 3, label: 'Step 3' },
  ];

  const renderComponent = (currentStep = 1) => {
    return render(
      <Stepper
        steps={mockSteps}
        currentStep={currentStep}
      />
    );
  };

  it('renders the correct number of steps', () => {
    renderComponent();
    expect(screen.getAllByTestId('step-container')).toHaveLength(mockSteps.length);
    expect(screen.getAllByTestId('step-label')).toHaveLength(mockSteps.length);
    expect(screen.getAllByTestId('step-circle')).toHaveLength(mockSteps.length);
  });

  it('renders progress lines between steps', () => {
    renderComponent();
    expect(screen.getAllByTestId('progress-line')).toHaveLength(mockSteps.length - 1);
  });

  it('marks current step correctly with active styling', () => {
    renderComponent(1); // Current step is 1 (second step)

    const currentStep = screen.getAllByTestId('step-circle')[1];
    expect(currentStep).toHaveClass('bg-[#009BDF]');

    const currentLabel = screen.getAllByTestId('step-label')[1];
    expect(currentLabel).toHaveClass('text-[#005399]');
  });

  it('marks future steps correctly with inactive styling', () => {
    renderComponent(1); // Current step is 1

    const futureStep = screen.getAllByTestId('step-circle')[2];
    expect(futureStep).toHaveClass('border-[#009BDF]');

    const futureLabel = screen.getAllByTestId('step-label')[2];
    expect(futureLabel).toHaveClass('text-[#84888C]');
  });

  it('does not render progress line after last step', () => {
    renderComponent();
    const progressLines = screen.getAllByTestId('progress-line');
    expect(progressLines).toHaveLength(mockSteps.length - 1);
  });
});
