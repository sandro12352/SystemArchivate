import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);


  createUser(user:User):Observable<any>{
   return this.http.post<any>(`${environment.API_URL}/api/usuarios`,user);
  }







}
