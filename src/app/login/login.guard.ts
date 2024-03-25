import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../shared/service/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject( Router);
  const loginService = inject( LoginService);

  if ((sessionStorage.getItem('id')) !== null) {
    return true
  }
  return router.createUrlTree(['login']);
};
