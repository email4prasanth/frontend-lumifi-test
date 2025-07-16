import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorHandler } from './api-error-handler';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

const createAxiosError = (status: number, message?: string): AxiosError => {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    config: {},
    toJSON: () => ({}),
    response: {
      status,
      data: { message },
      statusText: '',
      headers: {},
      config: {},
    },
  } as AxiosError;
};

describe('ApiErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles 400 error', async () => {
    const error = createAxiosError(400, 'Invalid input');
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith('Invalid input');
  });

  it('handles 401 error', async () => {
    const error = createAxiosError(401);
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.warn).toHaveBeenCalledWith('Your session has expired. Please log in to continue.');
  });

  it('handles 403 error', async () => {
    const error = createAxiosError(403);
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith("You don't have permission to access this resource");
  });

  it('handles 404 error', async () => {
    const error = createAxiosError(404);
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith('Requested resource not found.');
  });

  it('handles 500 error', async () => {
    const error = createAxiosError(500);
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith('Server error. Please try again later.');
  });

  it('handles unknown status with message', async () => {
    const error = createAxiosError(418, 'I am a teapot');
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith('I am a teapot');
  });

  it('handles unknown status without message', async () => {
    const error = createAxiosError(418);
    await expect(ApiErrorHandler.handle(error)).rejects.toBe(error);
    expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.');
  });
});
