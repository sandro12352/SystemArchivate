import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
}
