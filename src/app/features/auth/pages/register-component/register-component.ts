import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Password } from "primeng/password";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SupabaseService } from '../../../../core/services/supabase-service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../users/services/user-service';
import { User } from '../../../users/interfaces/user.interface';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'app-register-component',
  imports: [RouterLink, Password,InputTextModule,ButtonModule,CommonModule,ReactiveFormsModule,MessageModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent implements OnInit{
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);

  public registerForm!:FormGroup;
  emailSend = signal(false);
  errorMessage = signal('');
  loadingCreate = signal(false);
  
  ngOnInit(): void {
    this.registerForm =  this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword:['',[Validators.required,Validators.minLength(6)]],
      terms:[false,[Validators.requiredTrue]]
    },
    {
      validators:this.passwordMatchValidator
    }
  )   
  }

  get email(){
   return this.registerForm.get("email");
    
  }

  get password(){
    return this.registerForm.get('password');
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }


   async loginWithEmail(){
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return
    }
    this.loadingCreate.set(true);
    this.errorMessage.set('');

      const user:User = {
            ...this.registerForm.value,
            rol: {
              id_rol:2,
              nombre:'Cliente'
            },
        }

    this.userService.createUser(user).subscribe({
      next:async()=>{
        try {
          const {email,password,confirmPassword}= this.registerForm.value;

          if(password != confirmPassword){
            this.errorMessage.set("Contraseñas no coinciden");
            return ;
          }
            const { data, error } = await this._supabaseClient.auth.signUp({
              email,
              password
            });

          if (error) {
            console.error('Supabase signup error:', error);

            if (error.code === 'email_address_invalid') {
              this.errorMessage.set('Este correo no existe o no es válido');
            } else if (error.code === 'validation_failed') {
              this.errorMessage.set('La contraseña no cumple con los requisitos');
            } else {
              this.errorMessage.set(
                error.message || 'Error al crear la cuenta. Intenta de nuevo.'
              );
            }

            return;
          }
          // ✅ TODO OK
          this.emailSend.set(true);

        } catch (err) {
          console.error('Error inesperado:', err);
          this.errorMessage.set('Error inesperado. Por favor, intenta de nuevo.');
        } finally {
          this.loadingCreate.set(false);
        }
      },
        error:(err)=>{
          this.errorMessage.set(err.error.error);
          this.loadingCreate.set(false)
        }
      });


  }


 

//METODO REPETIDO UNIFICARLO DESPUES
public passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

}
