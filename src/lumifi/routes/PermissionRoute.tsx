import type { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getAccess } from '../types';

interface PermissionRouteProps {
  role?: string;
  route: string;
  children: React.ReactNode;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ role, route, children }) => {
  const fallbackRole = useSelector((state: RootState) => state.me.details?.role);
  const hasAccess = getAccess(role ?? fallbackRole ?? '', route);

  if (!hasAccess) {
    return (
      <Navigate
        to='/no-access'
        replace
      />
    );
  }

  return <>{children}</>;
};
