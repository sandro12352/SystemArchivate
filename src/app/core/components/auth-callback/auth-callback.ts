import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { AuthService } from '../../../features/auth/services/auth-service';
import { User } from '../../../features/auth/interfaces/user.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth-callback',
  standalone:true,
  imports: [ProgressSpinnerModule, SelectModule, ButtonDirective, InputText,CommonModule],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private authService = inject(AuthService);
  private router = inject(Router);
  public userLogin?:User;

  tiposPersona = [
    { label: 'Persona Natural', value: 'natural' },
    { label: 'Empresa', value: 'empresa' }
  ];

  async ngOnInit() {
    const token = await this.authService.getSessionToken();

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
