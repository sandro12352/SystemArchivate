import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PlanMarketing } from '../interfaces/plan-marketing.interface';

@Injectable({
    providedIn: 'root',
})
export class PlanMarketingService {
    private http = inject(HttpClient);

    /**
     * Obtiene el plan de marketing pendiente del cliente
     * Si no hay plan pendiente, retorna null
     */
    getPlanMarketingPendiente(token: string): Observable<PlanMarketing | null> {
        return this.http.get<PlanMarketing | null>(`${environment.API_URL}/api/plan-marketing/pendiente`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Marca el plan como revisado y guarda las observaciones del cliente
     */
    marcarComoRevisado(idPlanMarketing: number, observaciones: string, token: string): Observable<PlanMarketing> {
        return this.http.patch<PlanMarketing>(
            `${environment.API_URL}/api/plan-marketing/${idPlanMarketing}/revisar`,
            { observaciones_cliente: observaciones },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    /**
     * Descarga el PDF del plan de marketing
     */
    descargarPdf(idPlanMarketing: number, token: string): Observable<Blob> {
        return this.http.get(`${environment.API_URL}/api/plan-marketing/${idPlanMarketing}/pdf`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        });
    }
}
