import { useCreatePractice } from '@/lumifi/hooks';
import type { DoctorInfo, LoginInfo, PracticeInfo, UsersInfo } from '@/lumifi/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './CreateAccount';

// Mock the hooks and components
vi.mock('@/lumifi/hooks', () => ({
  useCreatePractice: vi.fn(() => ({
    createPracticeAccount: vi.fn(),
    isPracticeAccountCreating: false,
    practiceSoftwareList: [],
    isPracticeSoftwareListLoading: false,
    fetchPracticeSoftwareList: vi.fn(),
    userRolesList: [{ id: '1', role_name: 'Account Owner' }],
    isUserRolesListLoading: false,
    fetchUserRolesList: vi.fn(),
    practiceSpecialtyList: [],
    isPracticeSpecialtyListLoading: false,
    fetchPracticeSpecialtyList: vi.fn(),
    userStatesList: [],
    isUserStatesListLoading: false,
    fetchUserStatesList: vi.fn(),
  })),
}));

vi.mock('@/lib/utils', () => ({
  t: (namespace: string, key: string) => `${namespace}.${key}`,
}));

// Mock child components
vi.mock('./stepper', () => ({
  Stepper: () => <div data-testid='stepper' />,
}));

vi.mock('./PracticeInfoForm', () => ({
  PracticeInfoForm: ({ onNext }: { onNext: (data: PracticeInfo) => void }) => (
    <div data-testid='practice-info-form'>
      <button onClick={() => onNext({} as PracticeInfo)}>Next</button>
    </div>
  ),
}));

vi.mock('./DoctorInfoForm', () => ({
  DoctorInfoForm: ({ onNext }: { onNext: (data: DoctorInfo) => void }) => (
    <div data-testid='doctor-info-form'>
      <button onClick={() => onNext({} as DoctorInfo)}>Next</button>
    </div>
  ),
}));

vi.mock('./LoginInfoForm', () => ({
  LoginInfoForm: ({ onNext }: { onNext: (data: LoginInfo) => void }) => (
    <div data-testid='login-info-form'>
      <button onClick={() => onNext({} as LoginInfo)}>Next</button>
    </div>
  ),
}));

vi.mock('./AddUsersInfo', () => ({
  AddUsersInfo: ({ onNext, onSkip }: { onNext: (data: UsersInfo) => void; onSkip: () => void }) => (
    <div data-testid='add-users-info'>
      <button onClick={() => onNext({} as UsersInfo)}>Next</button>
      <button onClick={onSkip}>Skip</button>
    </div>
  ),
}));

vi.mock('./TermsAgreement', () => ({
  TermsAgreement: ({ onFinish }: { onFinish: () => void }) => (
    <div data-testid='terms-agreement'>
      <button onClick={onFinish}>Finish</button>
    </div>
  ),
}));

vi.mock('./CongratulationsStep', () => ({
  CongratulationsStep: () => <div data-testid='congratulations-step' />,
}));

vi.mock('@/lib/ui/components/loader', () => ({
  Loader: ({ overlay }: { overlay: boolean }) => <div data-testid={`loader-${overlay ? 'overlay' : 'inline'}`} />,
}));

describe('RegisterForm Component', () => {
  const mockCreatePracticeAccount = vi.fn();

  beforeEach(() => {
    vi.mocked(useCreatePractice).mockReturnValue({
      createPracticeAccount: mockCreatePracticeAccount,
      isPracticeAccountCreating: false,
      practiceSoftwareList: [],
      isPracticeSoftwareListLoading: false,
      fetchPracticeSoftwareList: vi.fn(),
      userRolesList: [{ id: '1', role_name: 'Account Owner' }],
      isUserRolesListLoading: false,
      fetchUserRolesList: vi.fn(),
      practiceSpecialtyList: [],
      isPracticeSpecialtyListLoading: false,
      fetchPracticeSpecialtyList: vi.fn(),
      userStatesList: [],
      isUserStatesListLoading: false,
      fetchUserStatesList: vi.fn(),
      checkAccountAdminAvailability: vi.fn(),
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
  };

  it('renders initial loading state when data is loading', () => {
    vi.mocked(useCreatePractice).mockReturnValue({
      ...useCreatePractice(),
      isPracticeSoftwareListLoading: true,
    });

    renderComponent();
    expect(screen.getByTestId('loader-overlay')).toBeInTheDocument();
  });

  it('renders the initial form with practice info step', () => {
    renderComponent();
    expect(screen.getByTestId('practice-info-form')).toBeInTheDocument();
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByText('lumifi.createAcc.createAccount')).toBeInTheDocument();
  });

  it('navigates through all form steps', async () => {
    renderComponent();

    // Practice Info Step
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('doctor-info-form')).toBeInTheDocument();

    // Doctor Info Step
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('login-info-form')).toBeInTheDocument();

    // Login Info Step
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('add-users-info')).toBeInTheDocument();

    // Add Users Step - Test both next and skip
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('terms-agreement')).toBeInTheDocument();
  });

  it('handles skipping the add users step', async () => {
    renderComponent();

    // Navigate to Add Users step
    fireEvent.click(screen.getByText('Next')); // Practice Info
    fireEvent.click(screen.getByText('Next')); // Doctor Info
    fireEvent.click(screen.getByText('Next')); // Login Info

    // Skip Add Users
    fireEvent.click(screen.getByText('Skip'));
    expect(screen.getByTestId('terms-agreement')).toBeInTheDocument();
  });

  it('submits the form when terms are agreed', async () => {
    renderComponent();

    // Navigate through all steps
    fireEvent.click(screen.getByText('Next')); // Practice Info
    fireEvent.click(screen.getByText('Next')); // Doctor Info
    fireEvent.click(screen.getByText('Next')); // Login Info
    fireEvent.click(screen.getByText('Next')); // Add Users

    // Submit form
    fireEvent.click(screen.getByText('Finish'));
    expect(mockCreatePracticeAccount).toHaveBeenCalled();
  });

  it('shows loading state when submitting', async () => {
    vi.mocked(useCreatePractice).mockReturnValue({
      ...useCreatePractice(),
      isPracticeAccountCreating: true,
    });

    renderComponent();
    expect(screen.getByTestId('loader-inline')).toBeInTheDocument();
  });

  it('shows congratulations step after successful submission', async () => {
    let resolveCreate: (value?: unknown) => void;
    mockCreatePracticeAccount.mockImplementation((_, onComplete) => {
      return new Promise<void>((resolve) => {
        resolveCreate = () => {
          onComplete();
          resolve();
        };
      });
    });

    renderComponent();

    // Navigate to terms agreement
    fireEvent.click(screen.getByText('Next')); // Practice Info
    fireEvent.click(screen.getByText('Next')); // Doctor Info
    fireEvent.click(screen.getByText('Next')); // Login Info
    fireEvent.click(screen.getByText('Next')); // Add Users

    // Submit form
    fireEvent.click(screen.getByText('Finish'));

    // Resolve the mock promise and trigger callback
    await act(async () => {
      resolveCreate!();
    });

    expect(await screen.findByTestId('congratulations-step')).toBeInTheDocument();
  });

  it('renders support contact link', () => {
    renderComponent();
    expect(screen.getByText('lumifi.common.troubleRegistering')).toBeInTheDocument();
    expect(screen.getByText('lumifi.common.contactSupport')).toBeInTheDocument();
  });
});
