import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GetPracticeSoftwareListApi } from './get-practice-software';
import { axiosInstance } from './executer';
import type { IGetPracticeSoftwareList } from '../types';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('GetPracticeSoftwareListApi', () => {
  const mockData: IGetPracticeSoftwareList[] = [
    { id: '1', software_name: 'Software A' },
    { id: '2', software_name: 'Software B' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the correct API endpoint and returns data', async () => {
    (axiosInstance.get as Mock).mockResolvedValue(mockData);

    const result = await GetPracticeSoftwareListApi();

    expect(axiosInstance.get).toHaveBeenCalledWith('/practice/software');
    expect(result).toEqual(mockData);
  });

  it('throws an error when the API call fails', async () => {
    (axiosInstance.get as Mock).mockRejectedValue(new Error('Network error'));

    await expect(GetPracticeSoftwareListApi()).rejects.toThrow('Network error');
  });
});
