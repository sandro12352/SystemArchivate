import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonDirective } from "primeng/button";
import { RouterLink } from "@angular/router";
import { SupabaseService } from '../../../../core/services/supabase-service';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-recover-component',
  standalone:true,
  imports: [ButtonDirective, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule ,MessageModule],
  templateUrl: './recover-component.html',
  styleUrl: './recover-component.css',
})
export class RecoverComponent implements OnInit{
  public isEmailLoading = signal(false);
  public emailSend = signal(false);
  
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private formBuilder = inject(FormBuilder);
  public recoverForm!:FormGroup;
  
  
  ngOnInit(): void {
    this.recoverForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]]
    })
  }

  get email(){
    return this.recoverForm.get('email');
  }

  sendResetPassword(){
    this.isEmailLoading.set(true)

    if(this.recoverForm.invalid){
      this.recoverForm.markAllAsTouched();
      this.isEmailLoading.set(false);
        return
    }

    const email = this.recoverForm.value.email;
    
    this._supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:`${environment.PATH}/auth/update-password`,
      }
    );

    this.emailSend.set(true);


  }




}
