import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from "primeng/button";
import { InputText } from "primeng/inputtext";


@Component({
  selector: 'app-auth-callback',
  standalone:true,
  imports: [ProgressSpinnerModule, SelectModule, ButtonDirective, InputText],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private router = inject(Router);
  private http = inject(HttpClient);

  tiposPersona = [
    { label: 'Persona Natural', value: 'natural' },
    { label: 'Empresa', value: 'empresa' }
  ];

  async ngOnInit() {
    const {data:{session},error} = await this._supabaseClient.auth.getSession();
    
  
    if(session){ 
      localStorage.setItem("token",session.access_token);
      console.log(session.access_token);

      this.http.post(`http://localhost:3000/api/auth/google`,{
        id_token:session.access_token
      }).subscribe({
        next:(resp)=>{
          this.router.navigate(['/dashboard']);
        },
        error(err){
          console.log(err);
        }
      })

    }else{
      console.log(error);
      this.router.navigate(['/login'])
    }
  }



}
