import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);


  createUser(user:User):Observable<any>{
   return this.http.post<any>(`http://localhost:3000/api/usuarios`,user);
  }







}
