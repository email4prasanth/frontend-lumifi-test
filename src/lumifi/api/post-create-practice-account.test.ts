import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ICreatePracticeRequest } from '../types';
import { axiosInstance } from './executer';
import { PostCreatePracticeAccountApi } from './post-create-practice-account';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('PostCreatePracticeAccountApi', () => {
  const mockRequest: ICreatePracticeRequest = {
    practiceInfo: {
      practiceName: 'Test Practice',
      address1: '123 Main St',
      address2: '',
      city: 'Test City',
      state: 'CA',
      zip: '90001',
      officeEmail: 'office@test.com',
      officePhone: '1234567890',
      websiteAddress: 'https://test.com',
      specialityId: '1',
      specialityName: 'Cardiology',
      practiceSoftwareId: '2',
      practiceSoftwareName: 'SoftwareX',
      hasAcceptedTerms: true,
      countryId: '1',
      country: 'USA',
    },
    doctorInfo: {
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john.doe@test.com',
      has2fa: false,
      phoneNumber: '1234567890',
      roleId: '1',
      role: 'Doctor',
      dea: 'DEA123',
      licenseNumber: 'LIC456',
      stateOfIssue: 'CA',
      password: 'password123',
      doctorEmailId: 'john.doe@test.com',
    },
    userInfo: [
      {
        firstName: 'Jane',
        lastName: 'Smith',
        emailId: 'jane.smith@test.com',
        has2fa: false,
        phoneNumber: '0987654321',
        roleId: '2',
        role: 'Admin',
        dea: '',
        licenseNumber: '',
        stateOfIssue: 'CA',
        password: 'password456',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the correct API endpoint with the request body and returns response', async () => {
    const mockResponse = { data: { success: true } };
    (axiosInstance.post as unknown as Mock).mockResolvedValue(mockResponse);

    const result = await PostCreatePracticeAccountApi(mockRequest);

    expect(axiosInstance.post).toHaveBeenCalledWith('/practice/register', mockRequest);
    expect(result).toEqual(mockResponse);
  });

  it('throws an error when the API call fails', async () => {
    (axiosInstance.post as unknown as Mock).mockRejectedValue(new Error('API error'));

    await expect(PostCreatePracticeAccountApi(mockRequest)).rejects.toThrow('API error');
  });
});
