import { setMeUser } from '@/store/slices/me';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { PostMeApi } from '../api';
import type { IMeUserPayload } from '../types';
import { useUserDetail } from './use-me';

vi.mock('../api', () => ({
  PostMeApi: vi.fn(),
}));
vi.mock('@/store/slices/me', () => ({
  setMeUser: vi.fn((user) => ({ type: 'SET_ME_USER', payload: user })),
}));
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('useUserDetail', () => {
  const payload = { id: 1 } as unknown as IMeUserPayload;
  const userDetails = { name: 'Test User' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set isFetching, call PostMeApi, dispatch setMeUser, and reset isFetching', async () => {
    (PostMeApi as unknown as Mock).mockResolvedValue({ userDetails });
    const { result } = renderHook(() => useUserDetail());

    expect(result.current.isFetching).toBe(false);

    await act(async () => {
      result.current.fetchUserDetail(payload);
    });

    expect(result.current.isFetching).toBe(false);
    expect(PostMeApi).toHaveBeenCalledWith(payload);
    expect(setMeUser).toHaveBeenCalledWith(userDetails);
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should set isFetching false and log error on PostMeApi failure', async () => {
    const error = new Error('fail');
    (PostMeApi as unknown as Mock).mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useUserDetail());

    await act(async () => {
      result.current.fetchUserDetail(payload);
    });

    expect(result.current.isFetching).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(mockDispatch).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
