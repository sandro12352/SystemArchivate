import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MenuItem, MessageService } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../auth/services/auth-service';
import { PlanMarketingService } from '../../services/plan-marketing-service';
import { ProyectoService } from '../../services/proyecto-service';
import { PlanMarketing, Proyecto, EstadoProyecto } from '../../interfaces/plan-marketing.interface';
import { finalize } from 'rxjs';

interface Actividad {
  fecha: string;
  descripcion: string;
  esHoy: boolean;
}

@Component({
  selector: 'app-dashboard-home-component',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    SpeedDialModule,
    DialogModule,
    TextareaModule
  ],
  templateUrl: './dashboard-home-component.html',
  styleUrl: './dashboard-home-component.css',
})
export class DashboardHomeComponent implements OnInit {
  items: MenuItem[] | undefined;

  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private planMarketingService = inject(PlanMarketingService);
  private proyectoService = inject(ProyectoService);

  user = this.authService.getUserSession();

  // Proyectos
  proyectos = signal<Proyecto[]>([]);
  cargandoProyectos = signal<boolean>(false);

  // Paginación
  paginaActual = signal<number>(1);
  itemsPorPagina = 3;

  totalPaginas = computed(() => {
    return Math.ceil(this.proyectos().length / this.itemsPorPagina) || 1;
  });

  proyectosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.proyectos().slice(inicio, fin);
  });

  // Próximas Actividades
  proximasActividades: Actividad[] = [
    {
      fecha: 'Hoy, 10:00 AM',
      descripcion: 'Reunión de seguimiento con el equipo de diseño',
      esHoy: true
    },
    {
      fecha: 'Mañana, 2:30 PM',
      descripcion: 'Revisión de creatividades para campaña de Verano',
      esHoy: false
    },
    {
      fecha: '18 Jun, 9:00 AM',
      descripcion: 'Presentación de resultados mensuales a la dirección',
      esHoy: false
    }
  ];

  ngOnInit(): void {
    this.cargarProyectos();
    this.inicializarSpeedDial();
  }



  private cargarProyectos(): void {
    if (!this.user?.token) return;

    this.cargandoProyectos.set(true);
    this.proyectoService.getProyectosByCliente(this.user.token)
      .pipe(finalize(() => this.cargandoProyectos.set(false)))
      .subscribe({
        next: (proyectos) => {
          this.proyectos.set(proyectos);
        },
        error: (err) => {
          console.error('Error al cargar proyectos:', err);
          // Datos de ejemplo para visualización
          this.proyectos.set([
            { id_proyecto: 1, id_cliente: 1, nombre: 'E-commerce Verano 2024', estado: EstadoProyecto.ACTIVO, fecha_inicio: new Date('2024-06-15') },
            { id_proyecto: 2, id_cliente: 1, nombre: 'Lanzamiento Marca X', estado: EstadoProyecto.ACTIVO, fecha_inicio: new Date('2024-07-01') },
            { id_proyecto: 3, id_cliente: 1, nombre: 'Campaña Retargeting Q3', estado: EstadoProyecto.EN_PAUSA, fecha_inicio: new Date('2024-08-20') },
            { id_proyecto: 4, id_cliente: 1, nombre: 'Campaña Black Friday', estado: EstadoProyecto.ACTIVO, fecha_inicio: new Date('2024-11-01') },
            { id_proyecto: 5, id_cliente: 1, nombre: 'Rebranding 2024', estado: EstadoProyecto.FINALIZADO, fecha_inicio: new Date('2024-03-10') }
          ]);
        }
      });
  }


  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  getEstadoLabel(estado: EstadoProyecto | string): string {
    switch (estado) {
      case EstadoProyecto.ACTIVO:
      case 'activo':
        return 'Activo';
      case EstadoProyecto.EN_PAUSA:
      case 'en_pausa':
        return 'En Pausa';
      case EstadoProyecto.FINALIZADO:
      case 'finalizado':
        return 'Finalizado';
      default:
        return String(estado);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  private inicializarSpeedDial(): void {
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