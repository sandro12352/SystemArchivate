import { Component, inject, OnInit, signal } from '@angular/core';
import { Password } from "primeng/password";
import { ButtonDirective } from "primeng/button";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../core/services/supabase-service';

@Component({
  selector: 'app-update-password-compenent',
  imports: [Password, ButtonDirective,ReactiveFormsModule],
  templateUrl: './update-password-compenent.html',
  styleUrl: './update-password-compenent.css',
})
export class UpdatePasswordCompenent implements OnInit{
  
  private formBuilder = inject(FormBuilder);
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  
  public isPasswordLoading = signal(false);
  
  public messageError = signal('');
  public resetPasswordConfirm = signal(false);

  public recoverForm!:FormGroup;
  
  ngOnInit(): void {
    this.recoverForm = this.formBuilder.group({
      password:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword:['',[Validators.required]]
    },{
       validators:this.passwordMatchValidator
    })
  }

  get password(){
    return this.recoverForm.get('password');
  }

  get confirmPassword(){
    return this.recoverForm.get('confirmPassword');
  }


  async resetPassword(){
    this.isPasswordLoading.set(true);
    
    if(this.recoverForm.invalid){
      this.recoverForm.markAllAsTouched();
      this.isPasswordLoading.set(false);
        return
    }

    const {password,confirmPassword }= this.recoverForm.value;

    if(password != confirmPassword){
      this.isPasswordLoading.set(false);
      return;
    }

    const {data,error} = await this._supabaseClient.auth.updateUser({
      password,
    });
    
    this.isPasswordLoading.set(false);

    if(error){
      this.messageError.set(error.message);
    }

    this.resetPasswordConfirm.set(true);
    


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
