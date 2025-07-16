import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GetUserStatesListApi } from './get-states';
import { axiosInstance } from './executer';
import type { IGetStatesList } from '../types';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('GetUserStatesListApi', () => {
  const mockStates: IGetStatesList[] = [
    {
      id: '1',
      dial_code: '+1',
      state_name: 'California',
      state_abbr: 'CA',
    },
    {
      id: '2',
      dial_code: '+1',
      state_name: 'Texas',
      state_abbr: 'TX',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the correct API endpoint and returns states', async () => {
    (axiosInstance.get as Mock).mockResolvedValue(mockStates);

    const result = await GetUserStatesListApi();

    expect(axiosInstance.get).toHaveBeenCalledWith('/state/list');
    expect(result).toEqual(mockStates);
  });

  it('throws an error when the API call fails', async () => {
    (axiosInstance.get as Mock).mockRejectedValue(new Error('API error'));

    await expect(GetUserStatesListApi()).rejects.toThrow('API error');
  });
});
