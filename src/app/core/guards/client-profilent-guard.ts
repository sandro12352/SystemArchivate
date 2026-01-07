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
    const session = authService.getUserSession();
    console.log(session)
    if (!session?.user) {
           return router.parseUrl('/login');
        };


    // 1. Validar token con backend
    const { exists, client } = await firstValueFrom(
      clientService.getClientByUserId(session.user.id_usuario)
    );

    

    // 3. Si existe cliente → dashboard
    if (exists) {
      authService.setUserSession({
        ...session,
        id_cliente: client.id_cliente,
      });

      return router.parseUrl('/dashboard');
    }

    // Cliente no existe → permitir mostrar formulario
    return true;

  } catch (error) {
    console.log(error)
    router.parseUrl('/login');
    return false;
  }finally{
    loaderService.hide();
  }
};
