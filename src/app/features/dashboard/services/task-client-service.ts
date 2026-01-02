import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { TaskClient, TaskClientVM } from '../interfaces/taskClient.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskClientService {
  private http = inject(HttpClient);

  getTaskClientsByClientId(id_cliente: number):Observable<TaskClientVM[]> {
    return this.http.get<TaskClient[]>(`${environment.API_URL}/api/task/${id_cliente}`).pipe(
     map(resp=>
      resp.map(item=>({
        id_cliente_tarea:item.id_cliente_tarea,
        id_tarea:item.tarea.id_tarea,
        nombre:item.tarea.nombre,
        descripcion:item.tarea.descripcion,
        estado:item.estado === 'completado',
      }))
     )
    );
  }


}
