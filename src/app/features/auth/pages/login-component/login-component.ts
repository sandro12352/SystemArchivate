import { Component, inject, OnInit } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {Router, RouterLink } from "@angular/router";
import { SupabaseService } from '../../../../core/services/supabase-service';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-login-component',
  imports: [PasswordModule, ButtonModule, InputTextModule, ToastModule, RouterLink,ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit{
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  public messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public loginForm!:FormGroup;
  public isGoogleLoading = false;

  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
     email:['',[Validators.required,Validators.email]],
     password:['',Validators.required]
   })  
  }


  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }


  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return
    }

    

    return this.router.navigate(['/dashboard'])
  }



  async loginWithGoogle() {
    if (this.isGoogleLoading) return;
    this.isGoogleLoading = true;
    const { data, error } = await this._supabaseClient.auth.signInWithOAuth({
      provider:'google',
      options:{
        redirectTo:`http://localhost:4200/auth/callback`,
      }
    });

   if (error) console.error(error);

  }


}
