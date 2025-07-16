import { Navigate } from 'react-router-dom';
import {
  AccountActivatedPage,
  CreateAccountPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  ManageBillingPage,
  ManageSecurityDetailPage,
  ManageUserFromPage,
  ManageUsersListPage,
  PatientsPage,
  PracticeInfoDetailsPage,
  PracticeInfoEditPage,
  ReactivateAccountPage,
  ResetPasswordPage,
  ResetPasswordSuccessPage,
  SelectPracticeTypePage,
  SetPasswordPage,
  SettingsPage,
  TwoFactorAuthPage,
  VerificationPendingPage,
  WelcomePage,
} from '../pages';
import { AddPatientPage } from '../pages/add-patient/AddPatient';
import { EditPatientPage } from '../pages/edit-patient/EditPatient';
import { ManageDoctorFormPage } from '../pages/manage-doctor-form/ManageDoctorForm';
import { ManageDoctorListPage } from '../pages/manage-doctor-list/ManageDoctorList';
import { ManageSecurityEditPage } from '../pages/manage-security-edit/ManageSecurityEdit';
import { PermissionRoute } from './PermissionRoute';
import {
  ACCOUNT_ACTIVATED_ROUTE,
  ADD_DOCTOR_ROUTE,
  ADD_PATIENT_ROUTE,
  ADD_USER_ROUTE,
  EDIT_DOCTOR_ROUTE,
  EDIT_PATIENT_ROUTE,
  EDIT_USER_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  HOME_ROUTE,
  LIST_DOCTOR_ROUTE,
  LIST_USER_ROUTE,
  LOGIN_ROUTE,
  MANAGE_BILLING_ROUTE,
  MANAGE_SECURITY_EDIT_ROUTE,
  MANAGE_SECURITY_ROUTE,
  PATIENTS_ROUTE,
  PRACTICEINFO_SETTING_DETAILS_ROUTE,
  PRACTICEINFO_SETTING_EDIT_ROUTE,
  REACTIVATE_ACCOUNT_ROUTE,
  RESET_PASSWORD_ROUTE,
  RESET_PASSWORD_SUCCESS_ROUTE,
  SELECT_PRACTICE_TYPE_ROUTE,
  SET_PASSWORD_ROUTE,
  SET_PASSWORD_SUCCESS_ROUTE,
  SETTINGS_ROUTE,
  SIGNUP_PAGE_ROUTE,
  TWO_FACTOR_AUTH_ROUTE,
  VERIFICATION_PENDING_ROUTE,
  WELCOME_PAGE_ROUTE,
} from './route-definition';

export const SIGNUP_ROUTES = [
  {
    path: WELCOME_PAGE_ROUTE,
    element: <WelcomePage />,
  },
  {
    path: SIGNUP_PAGE_ROUTE,
    element: <CreateAccountPage />,
  },
];

export const PASSWORD_ROUTES = [
  {
    path: RESET_PASSWORD_SUCCESS_ROUTE,
    element: <ResetPasswordSuccessPage />,
  },
  {
    path: RESET_PASSWORD_ROUTE,
    element: <ResetPasswordPage />,
  },
  {
    path: SET_PASSWORD_ROUTE,
    element: <SetPasswordPage />,
  },
  {
    path: SET_PASSWORD_SUCCESS_ROUTE,
    element: <ResetPasswordSuccessPage />,
  },
];

export const LOGIN_ROUTES = [
  {
    path: '/',
    element: (
      <Navigate
        to={LOGIN_ROUTE}
        replace
      />
    ),
  },
  {
    path: LOGIN_ROUTE,
    element: <LoginPage />,
  },
  {
    path: TWO_FACTOR_AUTH_ROUTE,
    element: <TwoFactorAuthPage />,
  },
  {
    path: SELECT_PRACTICE_TYPE_ROUTE,
    element: <SelectPracticeTypePage />,
  },
  {
    path: FORGOT_PASSWORD_ROUTE,
    element: <ForgotPasswordPage />,
  },
  {
    path: VERIFICATION_PENDING_ROUTE,
    element: <VerificationPendingPage />,
  },
  {
    path: REACTIVATE_ACCOUNT_ROUTE,
    element: <ReactivateAccountPage />,
  },
  {
    path: ACCOUNT_ACTIVATED_ROUTE,
    element: <AccountActivatedPage />,
  },
];

export const APP_ROUTES = [
  {
    path: HOME_ROUTE,
    element: <HomePage />,
  },
  {
    path: PATIENTS_ROUTE,
    element: <PatientsPage />,
  },
  {
    path: ADD_PATIENT_ROUTE,
    element: <AddPatientPage />,
  },
  {
    path: EDIT_PATIENT_ROUTE,
    element: <EditPatientPage />,
  },
  {
    path: SETTINGS_ROUTE,
    element: <SettingsPage />,
    children: [
      {
        index: true,
        element: (
          <PermissionRoute route={PRACTICEINFO_SETTING_DETAILS_ROUTE}>
            <PracticeInfoDetailsPage />
          </PermissionRoute>
        ),
      },
      {
        path: PRACTICEINFO_SETTING_DETAILS_ROUTE,
        element: (
          <PermissionRoute route={PRACTICEINFO_SETTING_DETAILS_ROUTE}>
            <PracticeInfoDetailsPage />
          </PermissionRoute>
        ),
      },
      {
        path: PRACTICEINFO_SETTING_EDIT_ROUTE,
        element: (
          <PermissionRoute route={PRACTICEINFO_SETTING_EDIT_ROUTE}>
            <PracticeInfoEditPage />
          </PermissionRoute>
        ),
      },
      {
        path: LIST_USER_ROUTE,
        element: (
          <PermissionRoute route={LIST_USER_ROUTE}>
            <ManageUsersListPage />
          </PermissionRoute>
        ),
      },
      {
        path: ADD_USER_ROUTE,
        element: (
          <PermissionRoute route={ADD_USER_ROUTE}>
            <ManageUserFromPage />
          </PermissionRoute>
        ),
      },
      {
        path: EDIT_USER_ROUTE,
        element: (
          <PermissionRoute route={EDIT_USER_ROUTE}>
            <ManageUserFromPage />
          </PermissionRoute>
        ),
      },
      {
        path: LIST_DOCTOR_ROUTE,
        element: (
          <PermissionRoute route={LIST_DOCTOR_ROUTE}>
            <ManageDoctorListPage />
          </PermissionRoute>
        ),
      },
      {
        path: ADD_DOCTOR_ROUTE,
        element: (
          <PermissionRoute route={ADD_DOCTOR_ROUTE}>
            <ManageDoctorFormPage />
          </PermissionRoute>
        ),
      },
      {
        path: EDIT_DOCTOR_ROUTE,
        element: (
          <PermissionRoute route={EDIT_DOCTOR_ROUTE}>
            <ManageDoctorFormPage />
          </PermissionRoute>
        ),
      },
      {
        path: MANAGE_SECURITY_ROUTE,
        element: (
          <PermissionRoute route={MANAGE_SECURITY_ROUTE}>
            <ManageSecurityDetailPage />
          </PermissionRoute>
        ),
      },
      {
        path: MANAGE_SECURITY_EDIT_ROUTE,
        element: (
          <PermissionRoute route={MANAGE_SECURITY_EDIT_ROUTE}>
            <ManageSecurityEditPage />
          </PermissionRoute>
        ),
      },
      {
        path: MANAGE_BILLING_ROUTE,
        element: (
          <PermissionRoute route={MANAGE_BILLING_ROUTE}>
            <ManageBillingPage />
          </PermissionRoute>
        ),
      },
    ],
  },
];
