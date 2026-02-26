import { Component, computed, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../../auth/services/auth-service';
import { ProyectoService } from '../../../dashboard/services/proyecto-service';
import { ProyectoMaterial } from '../../interfaces/project-content.interface';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-project-content',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule
    ],
    templateUrl: './project-content-component.html',
    styleUrl: './project-content-component.css'
})
export class ProjectContentComponent implements OnInit {
    // ── Inyecciones ──
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private proyectoService = inject(ProyectoService);
    private sanitizer = inject(DomSanitizer);

    // ── Propiedades ──
    user = this.authService.getUserSession();
    materiales = signal<ProyectoMaterial[]>([]);
    cargando = signal<boolean>(true);
    previewMaterial = signal<ProyectoMaterial | null>(null);

    // Modal Rechazo
    materialARechazar = signal<ProyectoMaterial | null>(null);
    observacionRechazo = signal<string>('');
    procesandoEstado = signal<boolean>(false);

    // Panel de Referencia
    showReferencePanel = signal<boolean>(false);
    referenciaMode = signal<'file' | 'link'>('file');
    referenciaFile = signal<File | null>(null);
    referenciaLink = signal<string>('');
    subiendoReferencia = signal<boolean>(false);
    isDraggingRef = signal<boolean>(false);

    // ── Computed ──
    proyecto = computed(() => {
        const list = this.materiales();
        if (list.length > 0) {
            return list[0].carpeta_material.proyecto;
        }
        return null;
    });

    // ── Ciclo de vida ──
    ngOnInit(): void {
        const idProyecto = Number(this.route.snapshot.paramMap.get('id'));
        if (idProyecto) {
            this.cargarContenido(idProyecto);
        }
    }

    // ── Métodos ──
    private cargarContenido(idProyecto: number): void {
        if (!this.user?.token) return;

        this.cargando.set(true);
        this.proyectoService.getProyectoConContenido(idProyecto, this.user.token)
            .pipe(finalize(() => this.cargando.set(false)))
            .subscribe({
                next: (data: ProyectoMaterial[]) => {
                    this.materiales.set(data);
                    console.log(this.materiales());
                },
                error: (err) => {
                    console.error('Error al cargar contenido del proyecto:', err);
                }
            });
    }

    previsualizarMaterial(material: ProyectoMaterial): void {
        this.previewMaterial.set(material);
    }

    cerrarPreview(): void {
        this.previewMaterial.set(null);
        this.showReferencePanel.set(false);
        this.referenciaFile.set(null);
        this.referenciaLink.set('');
        this.referenciaMode.set('file');
    }

    getMaterialUrl(ruta: string): string {
        if (ruta.startsWith('http://') || ruta.startsWith('https://')) {
            return ruta;
        }
        return `${environment.API_URL}/${ruta}`;
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    getEstadoLabel(estado: string): string {
        switch (estado) {
            case 'completado':
                return 'Completado';
            case 'activo':
                return 'Activo';
            case 'en_progreso':
                return 'En Progreso';
            case 'planificacion':
                return 'Planificación';
            default:
                return estado.charAt(0).toUpperCase() + estado.slice(1);
        }
    }

    formatDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatDateShort(date: Date | string): string {
        return new Date(date).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short'
        });
    }

    getFileExtension(ruta: string): string {
        const parts = ruta.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'file';
    }

    isPdfFile(ruta: string): boolean {
        return this.getFileExtension(ruta) === 'pdf';
    }

    isImageFile(ruta: string): boolean {
        const ext = this.getFileExtension(ruta);
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
    }

    isVideoFile(ruta: string): boolean {
        const ext = this.getFileExtension(ruta);
        return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);
    }

    isDocFile(ruta: string): boolean {
        const ext = this.getFileExtension(ruta);
        return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
    }


    async downloadFile(content: ProyectoMaterial) {
        try {
            const response = await fetch(this.getMaterialUrl(content.ruta));

            if (!response.ok) {
                throw new Error('No se pudo descargar el archivo');
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = content.nombre || 'archivo';
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error al descargar archivo:', error);
        }
    }

    // ── Acciones de Estado ──
    aceptarMaterial(material: ProyectoMaterial): void {
        const idProyecto = Number(this.route.snapshot.paramMap.get('id'));
        if (!this.user?.token) return;

        this.procesandoEstado.set(true);
        this.proyectoService.actualizarEstadoMaterial(material.id_proyecto_material, 'aprobado', null, this.user.token)
            .pipe(finalize(() => this.procesandoEstado.set(false)))
            .subscribe({
                next: () => {
                    this.cargarContenido(idProyecto);
                },
                error: (err) => console.error('Error al aprobar material:', err)
            });
    }

    abrirModalRechazo(material: ProyectoMaterial): void {
        this.materialARechazar.set(material);
        this.observacionRechazo.set('');
    }

    cerrarModalRechazo(): void {
        this.materialARechazar.set(null);
        this.observacionRechazo.set('');
    }

    confirmarRechazo(): void {
        const material = this.materialARechazar();
        const idProyecto = Number(this.route.snapshot.paramMap.get('id'));
        if (!material || !this.user?.token) return;

        this.procesandoEstado.set(true);
        this.proyectoService.actualizarEstadoMaterial(material.id_proyecto_material, 'rechazado', this.observacionRechazo(), this.user.token)
            .pipe(finalize(() => {
                this.procesandoEstado.set(false);
                this.cerrarModalRechazo();
            }))
            .subscribe({
                next: () => {
                    this.cargarContenido(idProyecto);
                },
                error: (err) => console.error('Error al rechazar material:', err)
            });
    }

    // ── Referencia ──
    toggleReferencePanel(): void {
        this.showReferencePanel.update(v => !v);
    }

    isReferenceLink(ref: string): boolean {
        return ref.startsWith('http://') || ref.startsWith('https://');
    }

    onReferenceFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.referenciaFile.set(input.files[0]);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingRef.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingRef.set(false);
    }

    onDropReference(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingRef.set(false);
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            this.referenciaFile.set(event.dataTransfer.files[0]);
        }
    }

    subirReferencia(): void {
        const material = this.previewMaterial();
        if (!material || !this.user?.token) return;

        const idProyecto = Number(this.route.snapshot.paramMap.get('id'));
        this.subiendoReferencia.set(true);

        if (this.referenciaMode() === 'link' && this.referenciaLink()) {
            // Enviar link como referencia
            this.proyectoService.actualizarReferencia(material.id_proyecto_material, this.referenciaLink(), this.user.token)
                .pipe(finalize(() => this.subiendoReferencia.set(false)))
                .subscribe({
                    next: () => {
                        this.showReferencePanel.set(false);
                        this.referenciaLink.set('');
                        this.cargarContenido(idProyecto);
                    },
                    error: (err) => console.error('Error al guardar referencia:', err)
                });
        } else if (this.referenciaMode() === 'file' && this.referenciaFile()) {
            // Subir archivo como referencia
            this.proyectoService.subirArchivoReferencia(material.id_proyecto_material, this.referenciaFile()!, this.user.token)
                .pipe(finalize(() => this.subiendoReferencia.set(false)))
                .subscribe({
                    next: () => {
                        this.showReferencePanel.set(false);
                        this.referenciaFile.set(null);
                        this.cargarContenido(idProyecto);
                    },
                    error: (err) => console.error('Error al subir archivo de referencia:', err)
                });
        }
    }

    @HostListener('document:keydown.escape')
    onEscapeKey() {
        if (this.previewMaterial()) {
            this.cerrarPreview();
        } else if (this.materialARechazar()) {
            this.cerrarModalRechazo();
        }
    }
}
