import { ROUTES } from '@/config/routes.config';

export function isNavigationItemActive(pathname: string, href: string) {
  if (href === ROUTES.DASHBOARD) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}