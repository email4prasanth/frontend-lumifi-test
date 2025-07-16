import { PRIVACY_ROUTE, SUPPORT_ROUTE, TERMS_ROUTE } from '../routes';

export interface ILumifiMenuItem {
  key: string;
  name: string;
  link?: string;
}

export enum LumifiFooterItems {
  PRIVACY = 'Privacy',
  TERMS = 'Terms',
  SUPPORT = 'Support',
}

export const LUMIFI_FOOTER_ITEMS = [
  {
    key: 'Privacy',
    name: LumifiFooterItems.PRIVACY,
    link: PRIVACY_ROUTE,
  },
  {
    key: 'Terms',
    name: LumifiFooterItems.TERMS,
    link: TERMS_ROUTE,
  },
  {
    key: 'Support',
    name: LumifiFooterItems.SUPPORT,
    link: SUPPORT_ROUTE,
  },
];
