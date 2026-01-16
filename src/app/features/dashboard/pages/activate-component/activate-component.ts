import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskClientService } from '../../services/task-client-service';
import { AuthService } from '../../../auth/services/auth-service';
import { Router } from '@angular/router';
import { EstadoTarea, TaskClientVM } from '../../interfaces/taskClient.interface';
import { Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { StepperModule } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-activate-component',
  imports: [CardModule, ButtonModule, CommonModule, CheckboxModule, StepperModule,
    FormsModule,
    ProgressBarModule,
    TimelineModule,
    CarouselModule,
    DialogModule,
    TagModule, FileUploadModule],
  templateUrl: './activate-component.html',
  styleUrl: './activate-component.css',
})
export class ActivateComponent implements OnInit{
    private taskClientService = inject(TaskClientService);
    private authService = inject(AuthService);
    private router = inject(Router);

    fechaActual: string = new Date().toLocaleDateString('es-Es', {});

    uploadingTasks = signal<Set<number>>(new Set());

    public user = this.authService.getUserSession();

    porcentajeProgreso = computed(() => {
      const tareas = this.tareasDeCliente();
      const total = tareas.length;
      const completadas = tareas.filter(
        t => t.estado === EstadoTarea.SUBIDO
      ).length;

      return total === 0 ? 0 : Math.round((completadas / total) * 100);
    });

    tareasObligatorias$!: Observable<TaskClientVM[]>;
    tareasDeCliente = signal<TaskClientVM[]>([]);

    videos = [
      {
        titulo: 'Introducción al Dashboard',
        categoria: 'Primeros Pasos',
        duracion: '05:20',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400'
      },
      {
        titulo: 'Gestión de Tareas Avanzada',
        categoria: 'Productividad',
        duracion: '08:45',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=400'
      },
      {
        titulo: 'Configuración de Seguridad',
        categoria: 'Seguridad',
        duracion: '03:15',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400'
      }
    ];


    getNombreArchivo(tarea: TaskClientVM): string | null {
      const ruta = tarea.archivo_cliente?.[0]?.ruta;
      return ruta ? ruta.split('/').pop()! : null;
    }



    ngOnInit(): void {
      this.tareasObligatorias$ = this.taskClientService.getTaskClientsByClientId(this.user?.id_cliente!);
      // Suscribirse para obtener las tareas y calcular el progreso inicial
      this.tareasObligatorias$.subscribe(tareas => {
        this.tareasDeCliente.set(tareas);
      });

    }


    todasTareasCompletadas(): boolean {
        const tareas = this.tareasDeCliente();
        return tareas.length > 0 && tareas.every(tarea => tarea.estado === 'subido');
      }


    onFileSelected(event: Event, tarea: TaskClientVM): void {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];

      // ⬇️ UI: marcar tarea como subiendo
      this.uploadingTasks.update(set => {
        const next = new Set(set);
        next.add(tarea.id_cliente_tarea);
        return next;
      });

      this.taskClientService.uploadTaskFile(tarea.id_cliente_tarea, file , this.user?.nombre_completo!).subscribe({
        next: (resp) => {
          this.tareasDeCliente.update(tareas =>
            tareas.map(t =>
              t.id_cliente_tarea === tarea.id_cliente_tarea
                ? {
                  ...t,
                  estado: resp.data.tarea.estado,
                  archivo_cliente: [resp.data.archivo]
                }
                : t
            )
          );
        },
        error: () => {
          console.error('Error al subir archivo');
        },
        complete: () => {
          // ⬇️ UI: quitar estado subiendo
          this.uploadingTasks.update(set => {
            const next = new Set(set);
            next.delete(tarea.id_cliente_tarea);
            return next;
          });
        }
      });
    }

    isUploading(tarea: TaskClientVM): boolean {
      return this.uploadingTasks().has(tarea.id_cliente_tarea);
    }


    verifyTask(){
      this.router.navigate(['inicio/activate'])
    }
  
}
