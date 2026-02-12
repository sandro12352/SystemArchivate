import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-signature-pad',
    standalone: true,
    imports: [CommonModule, Button],
    template: `
    <div class="signature-container bg-white rounded-3xl border-2 border-dashed border-gray-200 p-4 relative overflow-hidden group hover:border-purple-300 transition-colors">
      <canvas #signatureCanvas 
        class="w-full h-64 cursor-crosshair touch-none bg-gray-50/50 rounded-2xl"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        (mouseleave)="onMouseUp()"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd()">
      </canvas>
      
      <div class="flex justify-between items-center mt-4">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Panel de Firma Digital</p>
        <div class="flex gap-2">
            <p-button 
                label="Limpiar" 
                icon="pi pi-refresh" 
                styleClass="p-button-text p-button-sm text-gray-500 hover:text-red-600"
                (onClick)="clear()">
            </p-button>
        </div>
      </div>

      @if (isEmpty) {
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
            <div class="text-center">
                <i class="pi pi-pencil text-4xl mb-2"></i>
                <p class="text-sm font-bold">Firma aquí</p>
            </div>
        </div>
      }
    </div>
  `,
    styles: [`
    :host { display: block; }
    .signature-container { min-width: 300px; }
    canvas { touch-action: none; }
  `]
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
    @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    @Output() onSign = new EventEmitter<Blob | null>();

    private ctx!: CanvasRenderingContext2D;
    private isDrawing = false;
    isEmpty = true;

    private resizeObserver!: ResizeObserver;

    ngAfterViewInit() {
        this.resizeObserver = new ResizeObserver(() => {
            this.initCanvas();
        });
        this.resizeObserver.observe(this.canvasRef.nativeElement);
    }

    private initCanvas() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Guardar contenido para no perderlo al redimensionar
        const tempImage = canvas.toDataURL();

        // Seteamos la resolución interna multiplicada por el DPR para nitidez
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);

        // AQUÍ ESTÁ EL CAMBIO: No usamos ctx.scale(dpr, dpr)
        // En su lugar, escalamos las coordenadas manualmente al dibujar
        this.resetContextStyles(dpr);

        if (!this.isEmpty) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = tempImage;
        }
    }

    private resetContextStyles(dpr: number = window.devicePixelRatio || 1) {
        this.ctx.strokeStyle = '#2d3748';
        this.ctx.lineWidth = 3 * dpr; // Ajustamos el ancho del trazo al DPR
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    // Método centralizado para obtener coordenadas exactas
    private getCoordinates(clientX: number, clientY: number): { x: number, y: number } {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();

        // Calculamos la proporción entre el tamaño interno y el visual
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Retornamos la posición exacta mapeada al buffer interno
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    onMouseDown(event: MouseEvent) {
        const coords = this.getCoordinates(event.clientX, event.clientY);
        this.startDrawing(coords.x, coords.y);
    }

    onMouseMove(event: MouseEvent) {
        if (this.isDrawing) {
            const coords = this.getCoordinates(event.clientX, event.clientY);
            this.draw(coords.x, coords.y);
        }
    }

    onMouseUp() {
        this.stopDrawing();
    }

    onTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touch = event.touches[0];
        const coords = this.getCoordinates(touch.clientX, touch.clientY);
        this.startDrawing(coords.x, coords.y);
    }

    onTouchMove(event: TouchEvent) {
        event.preventDefault();
        if (this.isDrawing) {
            const touch = event.touches[0];
            const coords = this.getCoordinates(touch.clientX, touch.clientY);
            this.draw(coords.x, coords.y);
        }
    }

    onTouchEnd() {
        this.stopDrawing();
    }

    private startDrawing(x: number, y: number) {
        this.isDrawing = true;
        this.isEmpty = false;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    private draw(x: number, y: number) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    private stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.closePath();
            this.emitSignature();
        }
    }

    clear() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.resetContextStyles();
        this.isEmpty = true;
        this.onSign.emit(null);
    }

    private emitSignature() {
        this.canvasRef.nativeElement.toBlob((blob) => {
            this.onSign.emit(blob);
        }, 'image/png');
    }

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}
