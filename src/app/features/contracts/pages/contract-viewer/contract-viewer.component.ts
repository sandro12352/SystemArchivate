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
    <div class="visor-overlay">
      <!-- Header del Visor -->
      <div class="visor-header">
        <div class="flex items-center gap-4">
          <p-button 
            icon="pi pi-arrow-left" 
            label="Volver"
            styleClass="p-button-text p-button-plain text-sm font-bold" 
            (onClick)="volver()">
          </p-button>
          <div class="h-8 w-px bg-gray-100 hidden sm:block"></div>
          <div class="flex flex-col">
            <h1 class="text-base md:text-lg font-bold text-gray-900 truncate max-w-[150px] md:max-w-xs leading-none mb-1">
              {{ titulo() }}
            </h1>
            <span class="text-[9px] font-black text-purple-600 uppercase tracking-widest">Documento Oficial</span>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
            <p-button 
              icon="pi pi-external-link" 
              label="Nueva Pestaña"
              styleClass="p-button-text p-button-secondary text-xs font-bold hidden md:flex" 
              (onClick)="abrirEnNuevaPestana()">
            </p-button>
        </div>
      </div>

      <!-- Área del PDF -->
      <div class="visor-content w-full h-full">
        <div class="pdf-container">
          @if (urlSegura()) {
            <iframe 
              [src]="urlSegura()!" 
              class="w-full h-full border-none shadow-2xl" 
              style="display: block;"
              allow="fullscreen"
              title="Visor de PDF">
            </iframe>
          } @else {
            <div class="flex flex-col items-center justify-center h-full gap-4 bg-white">
              <i class="pi pi-spin pi-spinner text-purple-600 text-4xl"></i>
              <p class="text-gray-500 font-medium">Cargando documento...</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .visor-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #f8fafc;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    .visor-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      z-index: 100;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .visor-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      justify-content: center;
      background: #475569;
      padding: 0;
    }

    .pdf-container {
      width: 100%;
      height: 100%;
      background: white;
    }

    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ContractViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  urlSegura = signal<SafeResourceUrl | null>(null);
  urlOriginal = signal<string | null>(null);
  titulo = signal<string>('Visor de Documento');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const url = params['url'];
      const title = params['title'];

      if (url) {
        this.urlOriginal.set(url);
        // Agregamos parámetros de PDF para forzar la barra de herramientas y scroll
        const separator = url.includes('?') ? '&' : '#';
        const pdfUrl = `${url}${separator}toolbar=1&navpanes=0&scrollbar=1&zoom=100`;
        this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl));
      }
      if (title) {
        this.titulo.set(title);
      }
    });
  }

  descargar(): void {
    const url = this.urlOriginal();
    if (url) {
      window.open(url, '_blank');
    }
  }

  abrirEnNuevaPestana(): void {
    const url = this.urlOriginal();
    if (url) {
      window.open(url, '_blank');
    }
  }

  volver(): void {
    this.router.navigate(['/home/contratos']);
  }
}

