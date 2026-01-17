import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth-service';
import { firstValueFrom } from 'rxjs';
import { ClientService } from '../../../features/clients/services/client-service';
import { LoaderService } from '../../../shared/services/loader-service';


@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private clientService = inject(ClientService);
  private loaderService = inject(LoaderService);

  async ngOnInit() {
    this.loaderService.show()
    try {
      const token = await this.authService.getSessionToken();
      console.log(token)
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      const authResp = await firstValueFrom(
        this.authService.sendTokenToBackend(token)
      );

      this.authService.setUserSession({
        user: authResp.user,
        nombre_completo: authResp.nombre_completo,
        token: authResp.token
      });
      console.log(authResp)

      const { exists } = await firstValueFrom(
        this.clientService.getClientByUserId(authResp.token)
      );

      this.router.navigate(exists ? ['home/activate'] : ['auth/profile-complete']);

    } catch (error) {
      console.log(error)
      this.router.navigate(['/login']);
    } finally {
      this.loaderService.hide()
    }
  }





}
