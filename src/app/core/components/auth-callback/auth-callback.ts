import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { AuthService } from '../../../features/auth/services/auth-service';
import { CommonModule } from '@angular/common';
import { User } from '../../../features/users/interfaces/user.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'app-auth-callback',
  standalone:true,
  imports: [ProgressSpinnerModule, SelectModule, ButtonDirective, InputText, CommonModule, DatePickerModule, InputTextModule, FloatLabel,MessageModule,ReactiveFormsModule],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private authService = inject(AuthService);
  private router = inject(Router);
  public userLogin?:User;
  public formBuilder = inject(FormBuilder);
  public submitted = signal(false);
  
  public clientForm!:FormGroup;


  tiposPersona = [
    { label: 'Persona Natural', value: 'natural' },
    { label: 'Empresa', value: 'empresa' }
  ];

  get tipoPersona(){
    return this.clientForm.get('tipoPersona');
  }

  get nombres(){
    return this.clientForm.get('nombres');
  }

  get apellidos(){
    return this.clientForm.get('apellidos');
  }

  get documento(){
    return this.clientForm.get('documento');
  }

  get telefono(){
    return this.clientForm.get('telefono');
  }

  get fechaNacimiento(){
    return this.clientForm.get('fechaNacimiento');
  }


  async ngOnInit() {
    this.clientForm = this.formBuilder.group({
      tipoPersona:[null,[Validators.required]],
      nombres:['',[Validators.required]],
      apellidos:['',[Validators.required]],
      documento:['',[Validators.required]],
      telefono:['',[Validators.required,Validators.pattern(/^\d{9}$/)]],
      fechaNacimiento:[null,[Validators.required]]
    });

    this.validTypePerson();

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

  validTypePerson(){ 
    this.clientForm.get('tipoPersona')!.valueChanges
      .subscribe(tipo => {

        const documentoControl = this.clientForm.get('documento')!;

        if (tipo === 'empresa') {
          documentoControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{11}$/)
          ]);
        } else if (tipo === 'natural') {
          documentoControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{8}$/)
          ]);
        } else {
          documentoControl.clearValidators();
        }

        documentoControl.updateValueAndValidity();
      });

  }

  onSubmit(){
    this.submitted.set(true);

    if (this.clientForm.invalid) {
      return;
    }

    





  }





}
