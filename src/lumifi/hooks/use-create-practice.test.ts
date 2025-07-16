import { t } from '@/lib/utils';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
  GetAccountAdminAvailabilityApi,
  GetPracticeSoftwareListApi,
  GetPracticeSpecialtyListApi,
  GetUserRolesListApi,
  GetUserStatesListApi,
  PostCreatePracticeAccountApi,
} from '../api';
import type { ICreatePracticeRequest } from '../types';
import { useCreatePractice } from './use-create-practice';

// Mock API responses
const mockSoftwareList = [{ id: '1', software_name: 'SoftwareA' }];
const mockRolesList = [{ id: '1', role_name: 'Admin' }];
const mockSpecialtyList = [{ id: '1', speciality_name: 'Cardiology' }];
const mockStatesList = [
  {
    id: '1',
    dial_code: '+1',
    state_name: 'California',
    state_abbr: 'CA',
  },
];

// Mock API modules
vi.mock('../api', () => ({
  GetPracticeSoftwareListApi: vi.fn(),
  GetUserRolesListApi: vi.fn(),
  GetPracticeSpecialtyListApi: vi.fn(),
  GetUserStatesListApi: vi.fn(),
  PostCreatePracticeAccountApi: vi.fn(),
  GetPracticeNameAvailabilityApi: vi.fn(),
  GetAccountAdminAvailabilityApi: vi.fn(),
}));

// Mock toast and translation
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/utils', () => ({
  t: vi.fn((key: string) => key),
}));

describe('useCreatePractice', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with default states', () => {
    const { result } = renderHook(() => useCreatePractice());

    expect(result.current.practiceSoftwareList).toEqual([]);
    expect(result.current.userRolesList).toEqual([]);
    expect(result.current.practiceSpecialtyList).toEqual([]);
    expect(result.current.userStatesList).toEqual([]);
    expect(result.current.isPracticeAccountCreating).toBe(false);
    expect(result.current.isPracticeSoftwareListLoading).toBe(false);
    expect(result.current.isUserRolesListLoading).toBe(false);
    expect(result.current.isPracticeSpecialtyListLoading).toBe(false);
    expect(result.current.isUserStatesListLoading).toBe(false);
  });

  describe('API fetching functions', () => {
    it('fetches practice software list successfully', async () => {
      (GetPracticeSoftwareListApi as Mock).mockResolvedValue(mockSoftwareList);
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.fetchPracticeSoftwareList();
      });
      expect(result.current.isPracticeSoftwareListLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isPracticeSoftwareListLoading).toBe(false);
      });

      expect(result.current.practiceSoftwareList).toEqual(mockSoftwareList);
    });

    it('handles error when fetching software list', async () => {
      (GetPracticeSoftwareListApi as Mock).mockRejectedValue(new Error('API error'));
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.fetchPracticeSoftwareList();
      });

      await waitFor(() => {
        expect(result.current.isPracticeSoftwareListLoading).toBe(false);
      });

      expect(result.current.practiceSoftwareList).toEqual([]);
    });

    it('fetches user roles list successfully', async () => {
      (GetUserRolesListApi as Mock).mockResolvedValue(mockRolesList);
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.fetchUserRolesList();
      });
      expect(result.current.isUserRolesListLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isUserRolesListLoading).toBe(false);
      });

      expect(result.current.userRolesList).toEqual(mockRolesList);
    });

    it('fetches practice specialty list successfully', async () => {
      (GetPracticeSpecialtyListApi as Mock).mockResolvedValue(mockSpecialtyList);
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.fetchPracticeSpecialtyList();
      });
      expect(result.current.isPracticeSpecialtyListLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isPracticeSpecialtyListLoading).toBe(false);
      });

      expect(result.current.practiceSpecialtyList).toEqual(mockSpecialtyList);
    });

    it('fetches user states list successfully', async () => {
      (GetUserStatesListApi as Mock).mockResolvedValue(mockStatesList);
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.fetchUserStatesList();
      });
      expect(result.current.isUserStatesListLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isUserStatesListLoading).toBe(false);
      });

      expect(result.current.userStatesList).toEqual(mockStatesList);
    });
  });

  describe('Account creation', () => {
    const mockPracticeData: ICreatePracticeRequest = {
      practiceInfo: {
        practiceName: 'Test Clinic',
        address1: '123 Main St',
        address2: '',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        officeEmail: 'office@test.com',
        officePhone: '555-1234',
        websiteAddress: 'https://test.com',
        specialityId: '1',
        specialityName: 'Cardiology',
        practiceSoftwareId: '1',
        practiceSoftwareName: 'SoftwareA',
        hasAcceptedTerms: true,
        countryId: '1',
        country: 'USA',
      },
      doctorInfo: {
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'doctor@test.com',
        has2fa: false,
        phoneNumber: '555-5678',
        roleId: '1',
        role: 'Admin',
        dea: '123456',
        licenseNumber: 'CA12345',
        stateOfIssue: 'CA',
        password: 'password123',
        doctorEmailId: 'doctor@test.com',
      },
      userInfo: [],
    };

    it('creates practice account successfully', async () => {
      (PostCreatePracticeAccountApi as Mock).mockResolvedValue({});
      const onCompleteMock = vi.fn();
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.createPracticeAccount(mockPracticeData, onCompleteMock);
      });
      expect(result.current.isPracticeAccountCreating).toBe(true);

      await waitFor(() => {
        expect(result.current.isPracticeAccountCreating).toBe(false);
      });

      expect(toast.success).toHaveBeenCalledWith(t('lumifi', 'practiceAccount.success'));
      expect(onCompleteMock).toHaveBeenCalled();
    });

    it('handles account creation failure', async () => {
      (PostCreatePracticeAccountApi as Mock).mockRejectedValue(new Error('API error'));
      const onCompleteMock = vi.fn();
      const { result } = renderHook(() => useCreatePractice());

      act(() => {
        result.current.createPracticeAccount(mockPracticeData, onCompleteMock);
      });

      await waitFor(() => {
        expect(result.current.isPracticeAccountCreating).toBe(false);
      });

      expect(toast.success).not.toHaveBeenCalled();
      expect(onCompleteMock).not.toHaveBeenCalled();
    });
  });

  describe('Availability checks', () => {
    it('checks account owner availability', async () => {
      (GetAccountAdminAvailabilityApi as Mock).mockResolvedValue(false);
      const { result } = renderHook(() => useCreatePractice());

      const response = await result.current.checkAccountAdminAvailability('admin@test.com');
      expect(response).toBe(false);
    });
  });
});
