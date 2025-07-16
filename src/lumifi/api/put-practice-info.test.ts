import { describe, expect, it, vi, type Mock } from 'vitest';
import type { IUpdatePracticeInfo } from '../types';
import { axiosInstance } from './executer';
import { PutPracticeInfoApi } from './put-practice-info';

vi.mock('./executer', () => ({
  axiosInstance: {
    put: vi.fn(),
  },
}));

describe('PutPracticeInfoApi', () => {
  const mockPayload: IUpdatePracticeInfo = {
    id: 'practice-1',
    practiceName: 'Practice Name',
    address1: '123 Main St',
    address2: 'Suite 100',
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
  };
  const mockResponse = { success: true, data: mockPayload };

  it('should put practice info payload and return response', async () => {
    (axiosInstance.put as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PutPracticeInfoApi(mockPayload);

    expect(axiosInstance.put).toHaveBeenCalledWith('/practice/update', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when axiosInstance.put fails', async () => {
    (axiosInstance.put as Mock).mockRejectedValueOnce(new Error('Update failed'));

    await expect(PutPracticeInfoApi(mockPayload)).rejects.toThrow('Update failed');
  });
});
