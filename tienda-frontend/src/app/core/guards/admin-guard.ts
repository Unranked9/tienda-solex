import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  const rol = authService.getRol();
  if (rol === 'ROLE_ADMIN' || rol === 'ROLE_EMPLEADO') {
    return true;
  }

  return router.navigate(['/']);
};
