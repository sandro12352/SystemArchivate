import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../../features/clients/services/client-service';
import { AuthService } from '../../../features/auth/services/auth-service';
import { ButtonDirective } from "primeng/button";
import { InputText, InputTextModule } from "primeng/inputtext";
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-profile-complete',
  imports: [ButtonDirective, InputText, CommonModule, DatePickerModule, InputTextModule, FloatLabel, MessageModule, ReactiveFormsModule, SelectModule],
  templateUrl: './profile-complete.html',
  styleUrl: './profile-complete.css',
})
export class ProfileComplete {

  private router = inject(Router);
  public formBuilder = inject(FormBuilder);
  private clientService = inject(ClientService);
  private authService = inject(AuthService);

  public submitted = signal(false);

  public clientForm!: FormGroup;


  tiposPersona = [
    { label: 'Persona Natural', value: 'natural' },
    { label: 'Empresa', value: 'empresa' }
  ];

  get tipoPersona() {
    return this.clientForm.get('tipoPersona');
  }

  get nombres() {
    return this.clientForm.get('nombres');
  }

  get apellidos() {
    return this.clientForm.get('apellidos');
  }

  get documento() {
    return this.clientForm.get('documento');
  }

  get telefono() {
    return this.clientForm.get('telefono');
  }

  get fecha_nacimiento() {
    return this.clientForm.get('fecha_nacimiento');
  }

  get fecha_aniversario() {
    return this.clientForm.get('fecha_aniversario');
  }


  get userId() {
    return this.authService.getUserSession()?.user.id_usuario;
  }


  get token() {
    return this.authService.getUserSession()?.token;
  }


  async ngOnInit() {
    this.clientForm = this.formBuilder.group({
      tipoPersona: [null, [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      fecha_nacimiento: [null, [Validators.required]],
      fecha_aniversario: [null, [Validators.required]]
    });

    this.validTypePerson();
  }

  validTypePerson() {
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

  async onSubmit() {
    this.submitted.set(true);

    if (this.clientForm.invalid) {
      return;
    }


    const client = {
      ...this.clientForm.value,
      dni: this.clientForm.value.tipoPersona === 'natural' ? this.clientForm.value.documento : null,
      ruc: this.clientForm.value.tipoPersona === 'empresa' ? this.clientForm.value.documento : null,
    }


    this.clientService.createClient(client, this.token!).subscribe({
      next: (resp) => {

        const session = this.authService.getUserSession();
        console.log(session);

        this.authService.setUserSession({
          ...session!,
          nombre_completo: `${resp.client.nombres} ${resp.client.apellidos}`,
          token:resp.token,
          id_cliente: resp.client.id_cliente
        })

        console.log(resp.client);
        this.router.navigate(['home/activate']);
      },
      error: (err) => {
        console.log(err);
      }
    })






  }


}
