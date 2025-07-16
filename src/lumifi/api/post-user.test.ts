import { describe, expect, it, vi, type Mock } from 'vitest';
import type { ICreateUserPayload } from '../types';
import { axiosInstance } from './executer';
import { PostCreateUserApi } from './post-user';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('PostCreateUserApi', () => {
  const mockPayload: ICreateUserPayload = {
    firstName: 'John',
    lastName: 'Doe',
    emailId: 'john@example.com',
    has2fa: false,
    phoneNumber: '1234567890',
    roleId: 'role-1',
    role: 'User',
    dea: '',
    licenseNumber: '',
    stateOfIssue: 'CA',
  };
  const mockResponse = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    emailId: 'john@example.com',
    has2fa: false,
    phoneNumber: '1234567890',
    roleId: 'role-1',
    role: 'User',
    dea: '',
    licenseNumber: '',
    stateOfIssue: 'CA',
    password: 'password123',
  };

  it('should post create user payload and return response', async () => {
    (axiosInstance.post as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostCreateUserApi(mockPayload);

    expect(axiosInstance.post).toHaveBeenCalledWith('/user/create', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when axiosInstance.post fails', async () => {
    (axiosInstance.post as Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(PostCreateUserApi(mockPayload)).rejects.toThrow('Network Error');
  });
});
