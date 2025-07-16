import { clearUser } from '@/store/slices';
import type { RootState } from '@/store/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStorage = () => {
      const persistedAuth = localStorage.getItem('persist:root');
      if (isAuthenticated && !persistedAuth) {
        dispatch(clearUser());
      }
    };
    checkAuthStorage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'persist:root' || event.key === null) {
        checkAuthStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, isAuthenticated, location]);

  if (!isAuthenticated) {
    // Redirect to login and preserve current path for redirecting after login
    return (
      <Navigate
        to='/login'
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};
