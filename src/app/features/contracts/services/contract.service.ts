import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Contrato } from '../interfaces/contract.interface';

@Injectable({
    providedIn: 'root',
})
export class ContractService {
    private http = inject(HttpClient);

    /**
     * Obtiene los contratos del cliente
     */
    getContratos(token: string): Observable<Contrato[]> {
        return this.http.get<Contrato[]>(`${environment.API_URL}/api/contratos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Obtiene el contrato más reciente del cliente
     */
    getContratoReciente(token: string): Observable<Contrato | null> {
        return this.http.get<Contrato | null>(`${environment.API_URL}/api/contracts/reciente`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Actualiza la observación del contrato
     */
    actualizarObservacion(idContrato: number, observacion: string, token: string): Observable<Contrato> {
        return this.http.patch<Contrato>(
            `${environment.API_URL}/api/contracts/${idContrato}/observacion`,
            { observacion },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    /**
     * Envía la firma del cliente al backend
     */
    enviarFirma(idContrato: number, firmaBlob: Blob, token: string): Observable<Contrato> {
        const formData = new FormData();
        formData.append('firma', firmaBlob, `firma_contrato_${idContrato}.png`);

        return this.http.post<Contrato>(
            `${environment.API_URL}/api/contracts/${idContrato}/firmar`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
