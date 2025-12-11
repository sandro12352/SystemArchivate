import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Password } from "primeng/password";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-register-component',
  imports: [RouterLink, Password,InputTextModule,ButtonModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

}
