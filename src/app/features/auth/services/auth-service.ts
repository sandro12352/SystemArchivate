import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseLogin } from '../interfaces/user.interface';
import { SupabaseService } from '../../../core/services/supabase-service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _supabaseClient = inject(SupabaseService).supabaseClient;


  async getSessionToken(): Promise<string | null> {
    const { data, error } = await this._supabaseClient.auth.getSession();
    console.log(environment);

    if (error || !data.session) {
      return null;
    }

    const token = data.session.access_token;
    console.log(token)
    localStorage.setItem('token', token);

    return token;
  }

   sendTokenToBackend(token: string): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>( `http://localhost:3000/api/auth/google`,{},
       {
        headers: {Authorization: `Bearer ${token}`},
      }
      );
    }




}
