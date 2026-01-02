import { Component, inject, OnInit, Signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../auth/services/auth-service';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { TaskClientService } from '../../services/task-client-service';
import { TaskClientVM } from '../../interfaces/taskClient.interface';
import { Observable } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-dashboard-home-component',
  imports: [CardModule,ButtonModule,CommonModule,CheckboxModule,StepperModule,
    FormsModule,
    ProgressBarModule,
    TimelineModule,
    CarouselModule,
    TagModule,FileUploadModule],
  templateUrl: './dashboard-home-component.html',
  styleUrl: './dashboard-home-component.css',
})

export class DashboardHomeComponent implements OnInit{
  private taskClientService = inject(TaskClientService);
  private authService = inject(AuthService);
  fechaActual: string = new Date().toLocaleDateString('es-Es',{});
  
  porcentajeProgreso: number = 0;
  
  public user = this.authService.getUserSession();


  tareasObligatorias$!:Observable<TaskClientVM[]>;

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
  
   
  
  ngOnInit(): void {
    this.tareasObligatorias$ = this.taskClientService.getTaskClientsByClientId(this.user?.id_cliente!);  
  }

  actualizarProgreso(tareas: TaskClientVM[]): void {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.estado).length;
    this.porcentajeProgreso =
      total === 0 ? 0 : Math.round((completadas / total) * 100);
  }

  onFileSelected(event: Event, tarea: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    tarea.archivo = file;

    console.log('Archivo seleccionado:', file);
    console.log('Tarea:', tarea.id_cliente_tarea);
  }


}
