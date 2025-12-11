import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-auth-callback',
  imports: [ProgressSpinnerModule],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private router = inject(Router);

  async ngOnInit() {
    const {data:{session},error} = await this._supabaseClient.auth.getSession(); 
    if(session){
       localStorage.setItem("token",session.access_token);
      setTimeout(() => {
              this.router.navigate(['/dashboard']);

      }, 1000);

    }else{
      console.log(error);
      this.router.navigate(['/login'])
    }
  }



}
