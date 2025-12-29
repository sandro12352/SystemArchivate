import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseLogin } from '../interfaces/auth.interface';
import { SupabaseService } from '../../../core/services/supabase-service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  
  public userSession = signal<ResponseLogin['user'] | null>(this.loadUser());


  private loadUser(): ResponseLogin['user'] | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  async getSessionToken(): Promise<string | null> {
    const { data, error } = await this._supabaseClient.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    const token = data.session.access_token;
    localStorage.setItem('token', token);

    return token;
  }

   sendTokenToBackend(token: string): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>( `${environment.API_URL}/api/auth/`,{},
       {
        headers: {Authorization: `Bearer ${token}`},
      }
      );
    }


    setUserSession(user:ResponseLogin['user']| null){
      this.userSession.set(user);

       if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }

    }

    getUserSession() {
    return this.userSession();
  }

  async logout() {
      await this._supabaseClient.auth.signOut();
      this.setUserSession(null);
      return true;
    }

}
