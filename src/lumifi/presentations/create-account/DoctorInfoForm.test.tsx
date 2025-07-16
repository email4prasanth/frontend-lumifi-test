import { act, fireEvent, render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { DoctorInfoForm } from './DoctorInfoForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProps = {
  onNext: vi.fn(),
  userStatesList: [
    {
      id: '1',
      state_name: 'California',
      dial_code: '+1',
      state_abbr: 'CA',
    },
  ],
};

const component = (
  <MemoryRouter>
    <DoctorInfoForm
      onNext={mockProps.onNext}
      userStatesList={mockProps.userStatesList}
    />
  </MemoryRouter>
);

describe('DoctorInfoForm', () => {
  it('renders title and subtitle', async () => {
    const { getByTestId } = await act(async () => render(component));
    expect(getByTestId('doctor-title')).toBeInTheDocument();
    expect(getByTestId('doctor-subtitle')).toBeInTheDocument();
  });

  it('renders form fields', async () => {
    const { getByTestId } = await act(async () => render(component));

    expect(getByTestId('first-name')).toBeInTheDocument();
    expect(getByTestId('last-name')).toBeInTheDocument();
    expect(getByTestId('doctor-email')).toBeInTheDocument();
    expect(getByTestId('dea-number')).toBeInTheDocument();
    expect(getByTestId('has-no-dea-checkbox')).toBeInTheDocument();
    expect(getByTestId('cancel-button')).toBeInTheDocument();
    expect(getByTestId('next-button')).toBeInTheDocument();
  });

  it('shows license fields when hasNoDea is checked', async () => {
    const { getByTestId } = await act(async () => render(component));

    fireEvent.click(getByTestId('has-no-dea-checkbox'));

    expect(getByTestId('license-number')).toBeInTheDocument();
    expect(getByTestId('state')).toBeInTheDocument();
  });

  it('navigates to /login when cancel button is clicked', async () => {
    const { getByTestId } = await act(async () => render(component));

    fireEvent.click(getByTestId('cancel-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
