import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MenuItem, MessageService } from 'primeng/api';
import {SpeedDialModule} from 'primeng/speeddial'
@Component({
  selector: 'app-dashboard-home-component',
  imports: [Button,SelectModule,SpeedDialModule ],
  templateUrl: './dashboard-home-component.html',
  styleUrl: './dashboard-home-component.css',
})

export class DashboardHomeComponent implements OnInit {
  items: MenuItem[] | undefined;
  private messageService = inject(MessageService)

    proyectos = [
        { id: 1, nombre: 'E-commerce Verano 2024' },
        { id: 2, nombre: 'Lanzamiento Marca X' },
        { id: 3, nombre: 'Campaña Retargeting Q3' }
      ];
      
      proyectoSeleccionado = this.proyectos[0];
      
      campanas = [
        { nombre: 'Google Ads - Búsqueda', inversion: 1200, clicks: 450 },
        { nombre: 'Facebook / Instagram Ads', inversion: 850, clicks: 1200 },
        { nombre: 'YouTube Pre-roll', inversion: 500, clicks: 310 }
      ];
      
      // Lógica para cambiar de proyecto y recargar métricas
      onProyectoChange() {
        console.log('Cargando datos para:', this.proyectoSeleccionado.nombre);
        // Aquí llamarías a tu servicio de API
      }
  
  ngOnInit(): void {
       this.items = [
            {
                icon: 'pi pi-pencil',
                command: () => {
                    this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
                }
            },
            {
                icon: 'pi pi-refresh',
                command: () => {
                    this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
                }
            },
            {
                icon: 'pi pi-trash',
                command: () => {
                    this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
                }
            },
            {
                icon: 'pi pi-upload',
                routerLink: ['/fileupload']
            },
            {
                icon: 'pi pi-external-link',
                target: '_blank',
                url: 'https://angular.dev'
            }
        ];
      
      }
  }