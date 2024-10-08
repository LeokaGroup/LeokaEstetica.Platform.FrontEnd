import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const rt:any = route;
  // pass to /profile/restore w/o auth
  if (rt?._routerState.url === '/profile/restore') {
    return true;
  }
  return localStorage["t_n"] ? true : false;
};
