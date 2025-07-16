import { clearUser } from '@/store/slices';
import { store } from '@/store/store';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ApiError {
  message?: string;
  status?: number;
}

const apiMessage = ['Account does not exist'];

export class ApiErrorHandler {
  static handle(error: AxiosError) {
    const apiError = error.response?.data as ApiError;
    const status = error.response?.status;

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        toast.error(apiError?.message || 'Bad request. Please check your input.');
        break;

      case 401:
        toast.warn(
          apiMessage.includes(apiError?.message as string)
            ? apiError.message
            : 'Your session has expired. Please log in to continue.'
        );
        setTimeout(() => {
          store.dispatch(clearUser());
          window.location.href = '/login';
        }, 3000);
        break;

      case 403:
        toast.error(apiError?.message || "You don't have permission to access this resource");
        break;

      case 404:
        toast.error('Requested resource not found.');
        break;

      case 500:
        toast.error('Server error. Please try again later.');
        break;

      default:
        toast.error(apiError?.message || 'An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
}
