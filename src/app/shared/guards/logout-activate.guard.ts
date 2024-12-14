import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs/operators';

export const logoutActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLogged().pipe(
    map((loggedIn) => {
      if (loggedIn) {
        return router.createUrlTree(['/events']);
      } else {
        return true;
      }
    })
  );
};