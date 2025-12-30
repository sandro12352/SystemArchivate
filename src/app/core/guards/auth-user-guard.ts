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

  try {
    // 2. Validación con backend
    const authResp = await firstValueFrom(
      authService.sendTokenToBackend(token)
    );

    // 3. Backend no devuelve token válido
    if (!authResp.token) {
      throw new Error('Token backend inválido');
    }

    return true;

  } catch (error) {
    // 4. Cualquier error => logout forzado
    await authService.logout();
    router.navigate(['/login']);
    return false;
  }
};
