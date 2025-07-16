import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PracticeInfoForm } from './PracticeInfoForm';

const mockProps = {
  onNext: vi.fn(),
  userStatesList: [{ id: '1', state_name: 'California', dial_code: '+1', state_abbr: 'CA' }],
  practiceSpecialtyList: [{ id: '1', speciality_name: 'Dentistry' }],
  practiceSoftwareList: [{ id: '1', software_name: 'Dentrix' }],
};

const component = (
  <MemoryRouter>
    <PracticeInfoForm {...mockProps} />
  </MemoryRouter>
);

describe('PracticeInfoForm test suites', () => {
  it('lists all data-testid attributes in the component', async () => {
    const { getByTestId } = await act(async () => render(component));

    expect(getByTestId('practice-title')).toBeInTheDocument();
    expect(getByTestId('practice-info-form')).toBeInTheDocument();
    expect(getByTestId('practice-name')).toBeInTheDocument();
    expect(getByTestId('practice-address1')).toBeInTheDocument();
    expect(getByTestId('practice-address2')).toBeInTheDocument();
    expect(getByTestId('practice-city')).toBeInTheDocument();
    expect(getByTestId('autocomplete-menu')).toBeInTheDocument();
    expect(getByTestId('practice-zip')).toBeInTheDocument();
    expect(getByTestId('practice-office-email')).toBeInTheDocument();
    expect(getByTestId('practice-office-phone')).toBeInTheDocument();
    expect(getByTestId('practice-web-link')).toBeInTheDocument();
    expect(getByTestId('practice-software')).toBeInTheDocument();
    expect(getByTestId('practice-speciality')).toBeInTheDocument();
    expect(getByTestId('cancel-button')).toBeInTheDocument();
    expect(getByTestId('next-button')).toBeInTheDocument();
  });
});
