import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/plan-marketing.interface';
import { ProyectoMaterial } from '../../projects/interfaces/project-content.interface';

@Injectable({
    providedIn: 'root',
})
export class ProyectoService {
    private http = inject(HttpClient);

    /**
     * Obtiene todos los proyectos del cliente autenticado
     */
    getProyectosByCliente(token: string): Observable<Proyecto[]> {
        return this.http.get<Proyecto[]>(`${environment.API_URL}/api/projects`, {
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

    /**
     * Obtiene un proyecto con todo su contenido (materiales)
     */
    getProyectoConContenido(idProyecto: number, token: string): Observable<ProyectoMaterial[]> {
        return this.http.get<ProyectoMaterial[]>(`${environment.API_URL}/api/project-material/project/${idProyecto}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Actualiza el estado de un material (aceptado/rechazado)
     */
    actualizarEstadoMaterial(idMaterial: number, estado: string, observacion: string | null, token: string): Observable<any> {
        return this.http.patch(`${environment.API_URL}/api/project-material/cambiar-estado/${idMaterial}`,
            { estado, observacion },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    }

    /**
     * Actualiza la referencia de un material con un enlace
     */
    actualizarReferencia(idMaterial: number, referencia: string, token: string): Observable<any> {
        return this.http.patch(`${environment.API_URL}/api/project-material/${idMaterial}`,
            { referencia },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    }

    /**
     * Sube un archivo como referencia de un material
     */
    subirArchivoReferencia(idMaterial: number, archivo: File, token: string): Observable<any> {
        const formData = new FormData();
        formData.append('referencia', archivo);
        return this.http.patch(`${environment.API_URL}/api/project-material/${idMaterial}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    }
}
