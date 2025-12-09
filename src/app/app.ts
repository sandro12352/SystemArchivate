import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('system_archivate');
   menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      items: [
        { label: 'Lista', icon: 'pi pi-list', routerLink: ['/users'] },
        { label: 'Nuevo', icon: 'pi pi-plus', routerLink: ['/users/new'] }
      ]
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      items: [
        { label: 'Inventario', icon: 'pi pi-warehouse' },
        { label: 'Categorías', icon: 'pi pi-tags' }
      ]
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      routerLink: ['/settings']
    }
  ];
}
