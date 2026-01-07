import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth-service';
import { Button } from "primeng/button";
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import {OverlayBadgeModule } from 'primeng/overlaybadge';
import { BadgeModule } from 'primeng/badge';

import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';


@Component({
  selector: 'app-header-component',
  standalone:true,
  imports: [Menu, Button,AvatarModule,DividerModule,TitleCasePipe,OverlayBadgeModule,BadgeModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent  implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);
  public user = this.authService.getUserSession();
   

  userMenuItems: MenuItem[]|undefined;


  avatarUrl = computed(()=>{
    const foto = this.user?.user.foto_perfil
     return foto ;
  })


  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  showNotifications() {
    console.log('Mostrar notificaciones');
  }


 ngOnInit(): void {
  console.log(this.user)
      this.userMenuItems = [
        { label: 'Mi Perfil', icon: 'pi pi-user' ,linkClass: 'text-gray-900 '},
        { label: 'Configuración', icon: 'pi pi-cog' ,linkClass:'text-gray-900',},
        { separator: true },
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-sign-out',
          linkClass: '!text-red-500 dark:!text-red-400 ',
          command: () => this.logout()
        }
      ];
    }
}
