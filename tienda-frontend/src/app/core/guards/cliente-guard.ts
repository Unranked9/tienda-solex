import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const clienteGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.navigate(['/login']);
  }

  if (authService.getRol() === 'ROLE_CLIENTE') {
    return true;
  }

  return router.navigate(['/']);
};
