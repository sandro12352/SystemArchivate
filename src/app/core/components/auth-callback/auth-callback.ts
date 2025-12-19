import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { AuthService } from '../../../features/auth/services/auth-service';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ClientService } from '../../../features/clients/services/client-service';
@Component({
  selector: 'app-auth-callback',
  standalone:true,
  imports: [ProgressSpinnerModule, SelectModule, ButtonDirective, InputText, CommonModule, DatePickerModule, InputTextModule, FloatLabel,MessageModule,ReactiveFormsModule],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit{
  
  private router = inject(Router);
  public formBuilder = inject(FormBuilder);
  private clientService = inject(ClientService);
  private authService = inject(AuthService);

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

  get fecha_nacimiento(){
    return this.clientForm.get('fecha_nacimiento');
  }


  get userId(){
    return this.authService.getUserSession()?.id_usuario;
  }


  async ngOnInit() {
    this.clientForm = this.formBuilder.group({
      tipoPersona:[null,[Validators.required]],
      nombres:['',[Validators.required]],
      apellidos:['',[Validators.required]],
      documento:['',[Validators.required]],
      telefono:['',[Validators.required,Validators.pattern(/^\d{9}$/)]],
      fecha_nacimiento:[null,[Validators.required]]
    });

    this.validTypePerson();
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
    console.log(this.clientForm.value);

    const client = {
      ...this.clientForm.value,
      dni:this.clientForm.value.tipoPersona === 'natural' ? this.clientForm.value.documento : null,
      ruc:this.clientForm.value.tipoPersona === 'empresa' ? this.clientForm.value.documento : null,
    }


    this.clientService.createClient(this.userId!,client).subscribe({
      next:(resp)=>{
        console.log(resp);

        this.router.navigate(['/dashboard']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
    





  }



}
