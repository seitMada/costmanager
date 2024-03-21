import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../shared/service/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject( Router);
  const loginService = inject( LoginService);

  return loginService.isLoggedIn ?true: router.createUrlTree(['login']);
 
};
