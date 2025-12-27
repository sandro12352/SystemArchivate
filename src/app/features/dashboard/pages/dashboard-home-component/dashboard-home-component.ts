import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { User } from '../../../users/interfaces/user.interface';
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

@Component({
  selector: 'app-dashboard-home-component',
  imports: [CardModule,ButtonModule,CommonModule,CheckboxModule,StepperModule,
    FormsModule,
    ProgressBarModule,
    TimelineModule,
    CarouselModule,
    TagModule],
  templateUrl: './dashboard-home-component.html',
  styleUrl: './dashboard-home-component.css',
})

export class DashboardHomeComponent implements OnInit{
  fechaActual: string = 'Jueves, 24 de Octubre';
  porcentajeProgreso: number = 0;
  events: any[] = [];

  tareasObligatorias = [
    { titulo: 'Verificar Correo Electrónico', descripcion: 'Confirma tu identidad desde tu bandeja de entrada.', completada: true },
    { titulo: 'Completar Perfil Profesional', descripcion: 'Sube tu foto y datos de contacto actualizados.', completada: false },
    { titulo: 'Configurar Método de Pago', descripcion: 'Necesario para la facturación de servicios.', completada: false },
  ];

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
  
  private authService = inject(AuthService);
  public user:User | null = this.authService.getUserSession();
  
  ngOnInit(): void {
    console.log(this.user);
  
      this.actualizarProgreso();
  }

    actualizarProgreso() {
    const total = this.tareasObligatorias.length;
    const completadas = this.tareasObligatorias.filter(t => t.completada).length;
    this.porcentajeProgreso = Math.round((completadas / total) * 100);
  }

}
