import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/plan-marketing.interface';

@Injectable({
    providedIn: 'root',
})
export class ProyectoService {
    private http = inject(HttpClient);

    /**
     * Obtiene todos los proyectos del cliente autenticado
     */
    getProyectosByCliente(token: string): Observable<Proyecto[]> {
        return this.http.get<Proyecto[]>(`${environment.API_URL}/api/proyectos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Obtiene un proyecto específico por ID
     */
    getProyectoById(idProyecto: number, token: string): Observable<Proyecto> {
        return this.http.get<Proyecto>(`${environment.API_URL}/api/proyectos/${idProyecto}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
