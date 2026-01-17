import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../interface/client.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private http = inject(HttpClient);

  createClient(client: Client, token: string): Observable<Client> {
    return this.http.post<Client>(`${environment.API_URL}/api/clients/`, client, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getClientByUserId(token: string): Observable<{ client: Client, exists: boolean }> {
    return this.http.get<{ client: Client, exists: boolean }>(`${environment.API_URL}/api/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }



}
