import {
  activeCardIcon,
  activeDoctorIcon,
  activeLockIcon,
  activeToothIcon,
  activeUserIcon,
  cardIcon,
  doctorIcon,
  lockIcon,
  toothIcon,
  userIcon,
} from '@/assets/images';
import {
  ADD_DOCTOR_ROUTE,
  ADD_USER_ROUTE,
  EDIT_DOCTOR_ROUTE,
  EDIT_USER_ROUTE,
  LIST_DOCTOR_ROUTE,
  LIST_USER_ROUTE,
  MANAGE_BILLING_ROUTE,
  MANAGE_SECURITY_EDIT_ROUTE,
  MANAGE_SECURITY_ROUTE,
  PRACTICEINFO_SETTING_DETAILS_ROUTE,
  PRACTICEINFO_SETTING_EDIT_ROUTE,
} from '../routes';

export interface IMenuItem {
  key: string;
  name: string;
  icon: string;
  link?: string;
}

export enum SettingsMenuItems {
  PRACTICE_INFO = 'Practice Info',
  MANAGE_USERS = 'Manage Users',
  MANAGE_DOCTORS = 'Manage Doctors',
  SECURITY = 'Security',
  MANAGE_BILLING = 'Manage Billing',
}

export const ACCOUNT_OWNER_MENU_ITEMS = [
  {
    key: 'Practice Info',
    icon: toothIcon,
    name: SettingsMenuItems.PRACTICE_INFO,
    link: PRACTICEINFO_SETTING_DETAILS_ROUTE,
  },
  {
    key: 'Manage Users',
    icon: userIcon,
    activeIcon: activeUserIcon,
    name: SettingsMenuItems.MANAGE_USERS,
    link: LIST_USER_ROUTE,
  },
  {
    key: 'Manage Doctors',
    icon: doctorIcon,
    activeIcon: activeDoctorIcon,
    name: SettingsMenuItems.MANAGE_DOCTORS,
    link: LIST_DOCTOR_ROUTE,
  },
  {
    key: 'Security',
    icon: lockIcon,
    activeIcon: activeLockIcon,
    name: SettingsMenuItems.SECURITY,
    link: MANAGE_SECURITY_ROUTE,
  },
  {
    key: 'Manage Billing',
    icon: cardIcon,
    activeIcon: activeCardIcon,
    name: SettingsMenuItems.MANAGE_BILLING,
    link: MANAGE_BILLING_ROUTE,
  },
];

export const ADMIN_MENU_ITEMS = [
  {
    key: 'Practice Info',
    icon: toothIcon,
    activeIcon: activeToothIcon,
    name: SettingsMenuItems.PRACTICE_INFO,
    link: PRACTICEINFO_SETTING_DETAILS_ROUTE,
  },
  {
    key: 'Manage Users',
    icon: userIcon,
    activeIcon: activeUserIcon,
    name: SettingsMenuItems.MANAGE_USERS,
    link: LIST_USER_ROUTE,
  },
  {
    key: 'Manage Doctors',
    icon: doctorIcon,
    activeIcon: activeDoctorIcon,
    name: SettingsMenuItems.MANAGE_DOCTORS,
    link: LIST_DOCTOR_ROUTE,
  },
  {
    key: 'Security',
    icon: lockIcon,
    activeIcon: activeLockIcon,
    name: SettingsMenuItems.SECURITY,
    link: MANAGE_SECURITY_ROUTE,
  },
];

export const DOCTOR_MENU_ITEMS = [...ADMIN_MENU_ITEMS];

export const STAFF_MENU_ITEMS = [
  {
    key: 'Practice Info',
    icon: toothIcon,
    activeIcon: activeToothIcon,
    name: SettingsMenuItems.PRACTICE_INFO,
    link: PRACTICEINFO_SETTING_DETAILS_ROUTE,
  },
  {
    key: 'Security',
    icon: lockIcon,
    activeIcon: activeLockIcon,
    name: SettingsMenuItems.SECURITY,
    link: MANAGE_SECURITY_ROUTE,
  },
];

export const SYSTEM_ADMIN_MENU_ITEMS = [
  {
    key: 'Practice Info',
    icon: toothIcon,
    activeIcon: activeToothIcon,
    name: SettingsMenuItems.PRACTICE_INFO,
    link: PRACTICEINFO_SETTING_DETAILS_ROUTE,
  },
  {
    key: 'Security',
    icon: lockIcon,
    activeIcon: activeLockIcon,
    name: SettingsMenuItems.SECURITY,
    link: MANAGE_SECURITY_ROUTE,
  },
];

export const getMenuItems = (role: string): IMenuItem[] => {
  const mapFunction = {
    ['Account Owner']: ACCOUNT_OWNER_MENU_ITEMS,
    ['Admin']: ADMIN_MENU_ITEMS,
    ['Doctor']: DOCTOR_MENU_ITEMS,
    ['Staff']: STAFF_MENU_ITEMS,
    ['System Admin']: SYSTEM_ADMIN_MENU_ITEMS,
  };
  return mapFunction[role as keyof typeof mapFunction];
};

export enum ROLE {
  AccountOwner = 'Account Owner',
  Admin = 'Admin',
  Doctor = 'Doctor',
  Staff = 'Staff',
  SystemAdmin = 'System Admin',
}

const accessMap: Record<ROLE, string[]> = {
  [ROLE.AccountOwner]: [
    PRACTICEINFO_SETTING_DETAILS_ROUTE,
    PRACTICEINFO_SETTING_EDIT_ROUTE,
    LIST_USER_ROUTE,
    ADD_USER_ROUTE,
    EDIT_USER_ROUTE,
    LIST_DOCTOR_ROUTE,
    ADD_DOCTOR_ROUTE,
    EDIT_DOCTOR_ROUTE,
    MANAGE_SECURITY_ROUTE,
    MANAGE_SECURITY_EDIT_ROUTE,
    MANAGE_BILLING_ROUTE,
  ],
  [ROLE.Admin]: [
    PRACTICEINFO_SETTING_DETAILS_ROUTE,
    LIST_USER_ROUTE,
    ADD_USER_ROUTE,
    EDIT_USER_ROUTE,
    LIST_DOCTOR_ROUTE,
    ADD_DOCTOR_ROUTE,
    EDIT_DOCTOR_ROUTE,
    MANAGE_SECURITY_ROUTE,
    MANAGE_SECURITY_EDIT_ROUTE,
  ],
  [ROLE.Doctor]: [
    PRACTICEINFO_SETTING_DETAILS_ROUTE,
    LIST_USER_ROUTE,
    ADD_USER_ROUTE,
    EDIT_USER_ROUTE,
    LIST_DOCTOR_ROUTE,
    ADD_DOCTOR_ROUTE,
    EDIT_DOCTOR_ROUTE,
    MANAGE_SECURITY_ROUTE,
    MANAGE_SECURITY_EDIT_ROUTE,
  ],
  [ROLE.Staff]: [PRACTICEINFO_SETTING_DETAILS_ROUTE, MANAGE_SECURITY_ROUTE, MANAGE_SECURITY_EDIT_ROUTE],
  [ROLE.SystemAdmin]: [PRACTICEINFO_SETTING_DETAILS_ROUTE, MANAGE_SECURITY_ROUTE, MANAGE_SECURITY_EDIT_ROUTE],
};

// A function to Access routes based on user permissions
export const getAccess = (role: string, route: string): boolean => {
  const typedRole = role as ROLE;
  return accessMap[typedRole]?.includes(route) ?? false;
};
