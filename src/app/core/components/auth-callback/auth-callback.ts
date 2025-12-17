import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { AuthService } from '../../../features/auth/services/auth-service';
import { CommonModule } from '@angular/common';
import { User } from '../../../features/users/interfaces/user.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
@Component({
  selector: 'app-auth-callback',
  standalone:true,
  imports: [ProgressSpinnerModule, SelectModule, ButtonDirective, InputText,CommonModule,DatePickerModule,InputTextModule,FloatLabel],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private authService = inject(AuthService);
  private router = inject(Router);
  public userLogin?:User;
  public formBuilder = inject(FormBuilder);

  
  private clientForm!:FormGroup;


  tiposPersona = [
    { label: 'Persona Natural', value: 'natural' },
    { label: 'Empresa', value: 'empresa' }
  ];

  async ngOnInit() {
    this.clientForm = this.formBuilder.group({
      nombres:['',[Validators.required]],
      apellidos:['',[Validators.required]],
      documento:['',[Validators.required]],
      fecha_nacimiento:[]
    })



    const token = await this.authService.getSessionToken();
    console.log(token)
    if (!token) {
        this.router.navigate(['/login']);
        return;
    }

    this.authService.sendTokenToBackend(token).subscribe({
      next:(resp)=>{
        this.userLogin = resp.user;
        console.log(this.userLogin)
        
      },
      error:(err)=>{
        console.log(err);
      }
    })


  }



}
