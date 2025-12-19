import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';
import { ClientService } from '../../features/clients/services/client-service';
import { firstValueFrom } from 'rxjs';

export const clientProfilentGuard: CanActivateFn = async(route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const clientService = inject(ClientService);

  const token = await authService.getSessionToken();
  
  if (!token) {
        router.navigate(['/login']);
        return false;
      };

      try {  
        const authResp = await firstValueFrom(authService.sendTokenToBackend(token));
        const userLogin = authResp.user;
        authService.setUserSession(userLogin);


        const {client,exists} = await firstValueFrom(clientService.getClientByUserId(userLogin.id_usuario));
        console.log(client,exists);
        if(exists){
          router.navigate(['/dashboard']);
          return false;
        }
        
        return true;

      } catch (error) {
        console.log(error);
        router.navigate(['/login']);
        return false;
      }
};
