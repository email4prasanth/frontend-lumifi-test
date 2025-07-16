import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GetAccountAdminAvailabilityApi } from './get-account-admin-availability';
import { axiosInstance } from './executer';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockResponse = {
  available: true,
  message: 'Admin is available',
};

describe('GetAccountAdminAvailabilityApi', () => {
  const emailId = 'test@example.com';
  const endpoint = `/practice/accountAdminAvailability?emailId=${emailId}`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.get with correct URL', async () => {
    (axiosInstance.get as Mock).mockResolvedValueOnce(mockResponse);
    await GetAccountAdminAvailabilityApi(emailId);
    expect(axiosInstance.get).toHaveBeenCalledWith(endpoint);
  });

  it('should return the response as IAccountAdminAvailabilityResponse', async () => {
    (axiosInstance.get as Mock).mockResolvedValueOnce(mockResponse);
    const result = await GetAccountAdminAvailabilityApi(emailId);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.get fails', async () => {
    const errorMessage = 'Network Error';
    (axiosInstance.get as Mock).mockRejectedValueOnce(new Error(errorMessage));
    await expect(GetAccountAdminAvailabilityApi(emailId)).rejects.toThrow(errorMessage);
  });
});
