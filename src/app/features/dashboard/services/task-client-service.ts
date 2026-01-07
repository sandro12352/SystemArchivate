import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { EstadoTarea, TaskClient, TaskClientVM } from '../interfaces/taskClient.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskClientService {
  private http = inject(HttpClient);

  getTaskClientsByClientId(id_cliente: number):Observable<TaskClientVM[]> {
    return this.http.get<TaskClientVM[]>(`${environment.API_URL}/api/task/${id_cliente}`);
  }


  uploadTaskFile(id_cliente_tarea:number,file:File):Observable<any>{
    const formData = new FormData();

    formData.append('ruta',file);
    formData.append('id_cliente_tarea',id_cliente_tarea.toString());

    return this.http.post(`${environment.API_URL}/api/client-file`,formData,{
      withCredentials:true
    });

  }


}
