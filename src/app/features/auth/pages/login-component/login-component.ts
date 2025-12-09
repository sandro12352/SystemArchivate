import { Component, inject } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-login-component',
  imports: [PasswordModule, ButtonModule, InputTextModule, ToastModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  messageService = inject(MessageService);
}
