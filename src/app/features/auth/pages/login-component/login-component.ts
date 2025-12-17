import { Component, inject, OnInit, signal } from '@angular/core';
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
import { AuthService } from '../../services/auth-service';
import { ResponseLogin } from '../../interfaces/auth.interface';
import { User } from '../../../users/interfaces/user.interface';


@Component({
  selector: 'app-login-component',
  imports: [PasswordModule, ButtonModule, InputTextModule, RouterLink,ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit{
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  public messageService = inject(MessageService);
  public authService = inject(AuthService)
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  public user?:User;
 
  //Email Auth
  public errorMessage = signal('');
  public isEmailLoading = signal(false);
  
  public loginForm!:FormGroup;
  //Social Auth
  public isGoogleLoading = false; 
  public isFacebookLoading = false;


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


  async onSubmit(){
    this.isEmailLoading.set(true);

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.isEmailLoading.set(false);
        return
    }

    const { email, password } = this.loginForm.value;
    try {
      const { data, error } = await this._supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        this.errorMessage.set('Correo o contraseña incorrectos') ;
        return;
      }

      // ✅ VALIDAR EMAIL CONFIRMADO
      if (!data.user?.email_confirmed_at) {
         this.errorMessage.set('Debes confirmar tu correo antes de iniciar sesión');
        await this._supabaseClient.auth.signOut();
        return;
      }

      this.authService.sendTokenToBackend(data.session.access_token).subscribe({
        next:(resp:ResponseLogin)=>{
            this.user= resp.user;
        },
        error:(err)=>{

        }
      });

      // ✅ TODO OK → ENTRAR
      this.router.navigate(['/dashboard']);

    } catch (err) {
      this.errorMessage.set('Error inesperado. Intenta nuevamente.');
    }finally{
      this.isEmailLoading.set(false);
    }
  }



  async loginWithGoogle() {
    if (this.isGoogleLoading) return;
    this.isGoogleLoading = true;
    const { data, error } = await this._supabaseClient.auth.signInWithOAuth({
      provider:'google',
      options:{
        redirectTo:`${environment.PATH}/auth/callback`,
      }
    });

   if (error) console.error(error);

  }


}
