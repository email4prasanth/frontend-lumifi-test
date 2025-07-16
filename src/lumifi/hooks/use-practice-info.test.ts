import { act, renderHook } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import * as api from '../api';
import type { IUpdatePracticeInfo } from '../types';
import { usePracticeInfo } from './use-practice-info';

vi.mock('../api');
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn() },
}));

describe('usePracticeInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches practice info successfully', async () => {
    const mockRes = { id: '1', name: 'Test Practice' };
    (api.GetPracticeInfoApi as unknown as Mock).mockResolvedValueOnce(mockRes);

    const { result } = renderHook(() => usePracticeInfo());

    await act(async () => {
      result.current.getPracticeInfo('1');
    });

    expect(result.current.practiceInfo).toEqual(mockRes);
    expect(result.current.isPracticeInfoFetching).toBe(false);
  });

  it('handles error when fetching practice info', async () => {
    const error = new Error('fail');
    (api.GetPracticeInfoApi as unknown as Mock).mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => usePracticeInfo());

    await act(async () => {
      result.current.getPracticeInfo('1');
    });

    expect(result.current.practiceInfo).toBeNull();
    expect(result.current.isPracticeInfoFetching).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('updates practice info successfully', async () => {
    (api.PutPracticeInfoApi as unknown as Mock).mockResolvedValueOnce({ message: 'Updated' });

    const { result } = renderHook(() => usePracticeInfo());

    await act(async () => {
      result.current.updatePracticeInfo({} as unknown as IUpdatePracticeInfo);
    });

    expect(result.current.isPracticeInfoUpdating).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('Updated');
  });

  it('handles error when updating practice info', async () => {
    (api.PutPracticeInfoApi as unknown as Mock).mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => usePracticeInfo());

    await act(async () => {
      result.current.updatePracticeInfo({} as unknown as IUpdatePracticeInfo);
    });

    expect(result.current.isPracticeInfoUpdating).toBe(false);
  });

  it('fetches lists successfully', async () => {
    (api.GetPracticeSoftwareListApi as unknown as Mock).mockResolvedValueOnce([{ id: 1 }]);
    (api.GetPracticeSpecialtyListApi as unknown as Mock).mockResolvedValueOnce([{ id: 2 }]);
    (api.GetUserStatesListApi as unknown as Mock).mockResolvedValueOnce([{ id: 3 }]);

    const { result } = renderHook(() => usePracticeInfo());

    await act(async () => {
      await result.current.fetchList();
    });

    expect(result.current.softwareList).toEqual([{ id: 1 }]);
    expect(result.current.specialtyList).toEqual([{ id: 2 }]);
    expect(result.current.stateList).toEqual([{ id: 3 }]);
    expect(result.current.isListFetching).toBe(false);
  });

  it('handles error when fetching lists', async () => {
    (api.GetPracticeSoftwareListApi as unknown as Mock).mockRejectedValueOnce(new Error('fail'));
    (api.GetPracticeSpecialtyListApi as unknown as Mock).mockResolvedValueOnce([]);
    (api.GetUserStatesListApi as unknown as Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePracticeInfo());

    await act(async () => {
      await result.current.fetchList();
    });

    expect(result.current.isListFetching).toBe(false);
  });
});
