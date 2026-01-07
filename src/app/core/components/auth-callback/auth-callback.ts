import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth-service';
import { firstValueFrom } from 'rxjs';
import { ClientService } from '../../../features/clients/services/client-service';


@Component({
  selector: 'app-auth-callback',
  standalone:true,
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private router = inject(Router);  
  private authService = inject(AuthService);
  private clientService = inject(ClientService)

 async ngOnInit() {
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
    });
    console.log(authResp)

    const { exists } = await firstValueFrom(
      this.clientService.getClientByUserId(authResp.user.id_usuario)
    );

    this.router.navigate(exists ? ['/dashboard'] : ['auth/profile-complete']);

  } catch (error){
    console.log(error)
    this.router.navigate(['/login']);
  }
}


 


}
