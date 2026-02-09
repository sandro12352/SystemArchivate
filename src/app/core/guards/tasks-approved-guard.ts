import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../features/users/services/user-service';
import { TaskClientService } from '../../features/dashboard/services/task-client-service';
import { AuthService } from '../../features/auth/services/auth-service';
import { map } from 'rxjs';

export const tasksApprovedGuard: CanActivateFn = (route, state) => {
  const taskClientService = inject(TaskClientService);
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const token = authService.getUserSession()?.token;

  return taskClientService.getTaskClientsByClientId(token!).pipe(
    map(tareas=>{
      const todasAprobadas = tareas.length>0 && tareas.every(t=>t.estado==='aprobado');
      if(todasAprobadas){
        return router.parseUrl('home/dashboard');
      }
      return true;
    }
    )
  )


};
