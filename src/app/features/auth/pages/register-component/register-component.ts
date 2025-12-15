import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Password } from "primeng/password";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SupabaseService } from '../../../../core/services/supabase-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register-component',
  imports: [RouterLink, Password,InputTextModule,ButtonModule,CommonModule,ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent implements OnInit{
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private formBuilder = inject(FormBuilder);
  public registerForm!:FormGroup;
  public errorMessage?:string;
  emailSent = false;
  
  ngOnInit(): void {
    console.log("inicio de pagina : " , this.emailSent)
    this.registerForm =  this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmPaswword:['',[Validators.required,Validators.minLength(6)]]
    })   
  }

  get email(){
   return this.registerForm.get("email");
    
  }


  async loginWithEmail(){
    if(this.registerForm.invalid) return;

    const {email,password,confirmPaswword}= this.registerForm.value;

    if(password != confirmPaswword){
      this.errorMessage = "Contraseñas no coinciden";
      return ;
    }


    const {data,error} = await this._supabaseClient.auth.signUp({
      email,
      password
    })

     if (error) {
      this.errorMessage = error.message;
      return;
    }


     // Estado de éxito
    this.emailSent = true;
  }






}
