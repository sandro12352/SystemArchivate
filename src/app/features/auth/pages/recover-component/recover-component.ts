import { Component } from '@angular/core';
import { ButtonDirective } from "primeng/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-recover-component',
  standalone:true,
  imports: [ButtonDirective, RouterLink],
  templateUrl: './recover-component.html',
  styleUrl: './recover-component.css',
})
export class RecoverComponent {

}
