import { Component, inject } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {RouterLink } from "@angular/router";
import { SupabaseService } from '../../../../core/services/supabase-service';
@Component({
  selector: 'app-login-component',
  imports: [PasswordModule, ButtonModule, InputTextModule, ToastModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent{
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  messageService = inject(MessageService);


  async loginWithGoogle() {
    const { data, error } = await this._supabaseClient.auth.signInWithOAuth({
      provider:'google',
      options:{
        redirectTo:'http://localhost:4200/auth/callback',
      }
    });

   if (error) console.error(error);

  }


}
