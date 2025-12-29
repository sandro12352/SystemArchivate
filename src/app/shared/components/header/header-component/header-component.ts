import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth-service';
import { User } from '../../../../features/users/interfaces/user.interface';
import { MenuModule } from 'primeng/menu';
import { Button } from "primeng/button";
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import {OverlayBadgeModule } from 'primeng/overlaybadge';
import { BadgeModule } from 'primeng/badge';

import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-component',
  standalone:true,
  imports: [MenuModule, Button,AvatarModule,DividerModule,TitleCasePipe,OverlayBadgeModule,BadgeModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent  implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);
  public user:User | null = this.authService.getUserSession();
   

  userMenuItems: MenuModule[] = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => this.viewProfile()
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => this.openSettings()
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];


  viewProfile() {
    console.log('Ver perfil');
  }

  openSettings() {
    console.log('Abrir configuración');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  showNotifications() {
    console.log('Mostrar notificaciones');
  }


  ngOnInit(): void {
    console.log(this.user)
  }
}
