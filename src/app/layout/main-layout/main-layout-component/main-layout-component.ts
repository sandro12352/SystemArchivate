import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header-component/header-component';
import { FooterComponent } from '../../../shared/components/footer/footer-component/footer-component';
import { AuthService } from '../../../features/auth/services/auth-service';
import { TaskClientService } from '../../../features/dashboard/services/task-client-service';

@Component({
  selector: 'app-main-layout-component',
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.css',
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private taskService = inject(TaskClientService);

  sidebarVisible = signal<boolean>(false);

  ngOnInit(): void {
    this.verificarEstadoAprobacion();
  }

  private verificarEstadoAprobacion(): void {
    const token = this.authService.getUserSession()?.token;
    if (!token) return;

    this.taskService.getTaskClientsByClientId(token).subscribe({
      next: (tareas) => {
        const todasAprobadas = tareas.length > 0 && tareas.every(t => t.estado === 'aprobado');
        this.sidebarVisible.set(todasAprobadas);
      },
      error: () => {
        this.sidebarVisible.set(false);
      }
    });
  }
}
