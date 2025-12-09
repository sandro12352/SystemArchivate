import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Password } from "primeng/password";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register-component',
  imports: [RouterLink, Password,ButtonModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

}
