import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TaskClientService } from '../../features/dashboard/services/task-client-service';
import { AuthService } from '../../features/auth/services/auth-service';
import { map } from 'rxjs';

export const isApprovedGuard: CanActivateFn = (route, state) => {
    const taskClientService = inject(TaskClientService);
    const router = inject(Router);
    const authService = inject(AuthService);

    const token = authService.getUserSession()?.token;

    if (!token) return router.parseUrl('/login');

    return taskClientService.getTaskClientsByClientId(token).pipe(
        map(tareas => {
            const todasAprobadas = tareas.length > 0 && tareas.every(t => t.estado === 'aprobado');
            if (todasAprobadas) {
                return true;
            }
            // Si no están aprobadas, forzar ir a la página de activación
            return router.parseUrl('/home/activate');
        })
    );
};
