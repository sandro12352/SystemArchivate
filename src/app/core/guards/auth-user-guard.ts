import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';
import { firstValueFrom } from 'rxjs';

export const authUserGuard: CanActivateFn =async (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = await authService.getSessionToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // si no hay usuario backend cargado, recupéralo
  if (!authService.getUserSession()) {
    try {
      const authResp = await firstValueFrom(
        authService.sendTokenToBackend(token)
      );
      authService.setUserSession(authResp.user);
    } catch {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
