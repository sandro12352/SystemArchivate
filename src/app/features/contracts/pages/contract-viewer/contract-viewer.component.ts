import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-contract-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  template: `
    <div class="flex flex-col h-screen bg-gray-100">
      <!-- Header del Visor -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div class="flex items-center gap-4">
          <p-button 
            icon="pi pi-arrow-left" 
            styleClass="p-button-rounded p-button-text p-button-plain" 
            (onClick)="volver()">
          </p-button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ titulo() }}</h1>
            <p class="text-xs text-gray-500 font-medium">Visualización segura de documento</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black uppercase rounded-full">Modo Lectura</span>
        </div>
      </div>

      <!-- Área del PDF -->
      <div class="flex-1 p-2 md:p-4 flex justify-center overflow-hidden">
        <div class="w-full max-w-[98%] h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative">
          @if (urlSegura()) {
            <iframe [src]="urlSegura()!" class="w-full h-full border-none" style="display: block;" type="application/pdf"></iframe>
          } @else {
            <div class="flex flex-col items-center justify-center h-full gap-4">
              <i class="pi pi-spin pi-spinner text-purple-600 text-4xl"></i>
              <p class="text-gray-500 font-medium">Cargando documento...</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class ContractViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  urlSegura = signal<SafeResourceUrl | null>(null);
  titulo = signal<string>('Visor de Documento');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const url = params['url'];
      const title = params['title'];

      if (url) {
        this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      }
      if (title) {
        this.titulo.set(title);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/home/contratos']);
  }
}
