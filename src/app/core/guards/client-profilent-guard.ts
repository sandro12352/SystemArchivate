import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';
import { ClientService } from '../../features/clients/services/client-service';
import { firstValueFrom } from 'rxjs';
import { LoaderService } from '../../shared/services/loader-service';

export const clientProfilentGuard: CanActivateFn = async(route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const clientService = inject(ClientService);
  const loaderService = inject(LoaderService);


  loaderService.show()

  try {
    const token = await authService.getSessionToken();
    
    if (!token) {
          router.parseUrl('/login');
          return false;
        };


    // 1. Validar token con backend
    const authResp = await firstValueFrom(
      authService.sendTokenToBackend(token)
    );

    // 2. Guardar sesión
    authService.setUserSession({
      user: authResp.user,
      nombre_completo: authResp.nombre_completo
    });

    // 3. Verificar si el cliente ya existe
    const { exists,client } = await firstValueFrom(
      clientService.getClientByUserId(authResp.user.id_usuario)
    );

    

    // 4. Decidir acceso
    if (exists) {
      authService.setUserSession({
       user:authResp.user,
       nombre_completo: authResp.nombre_completo,
       id_cliente:client.id_cliente
    })
     return router.parseUrl('/dashboard');
    }

    // Cliente no existe → permitir mostrar formulario
    return true;

  } catch (error) {
    router.parseUrl('/login');
    return false;
  }finally{
    loaderService.hide();
  }
};
