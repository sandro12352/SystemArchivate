import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../auth/services/auth-service';
import { ProyectoService } from '../../../dashboard/services/proyecto-service';
import { Proyecto, EstadoProyecto } from '../../../dashboard/interfaces/plan-marketing.interface';

type FiltroEstado = 'todos' | 'activo' | 'en_progreso' | 'completado' | 'planificacion';

@Component({
    selector: 'app-projects-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './projects-list-component.html',
    styleUrl: './projects-list-component.css'
})
export class ProjectsListComponent implements OnInit {
    // ── Inyecciones ──
    private authService = inject(AuthService);
    private proyectoService = inject(ProyectoService);

    // ── Propiedades ──
    user = this.authService.getUserSession();
    proyectos = signal<Proyecto[]>([]);
    cargandoProyectos = signal<boolean>(false);
    searchTerm = signal<string>('');
    filtroActivo = signal<FiltroEstado>('todos');
    paginaActual = signal<number>(1);
    itemsPorPagina = 6;

    // ── Computed ──
    proyectosFiltrados = computed(() => {
        let lista = this.proyectos();

        // Filtro por estado
        const filtro = this.filtroActivo();
        if (filtro !== 'todos') {
            lista = lista.filter(p => p.estado === filtro);
        }

        // Filtro por búsqueda
        const term = this.searchTerm().toLowerCase().trim();
        if (term) {
            lista = lista.filter(p =>
                p.nombre.toLowerCase().includes(term) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(term))
            );
        }

        return lista;
    });

    totalPaginas = computed(() => {
        return Math.ceil(this.proyectosFiltrados().length / this.itemsPorPagina) || 1;
    });

    proyectosPaginados = computed(() => {
        const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        return this.proyectosFiltrados().slice(inicio, fin);
    });

    // ── Métodos del ciclo de vida ──
    ngOnInit(): void {
        this.cargarProyectos();
    }

    // ── Métodos ──
    private cargarProyectos(): void {
        if (!this.user?.token) return;

        this.cargandoProyectos.set(true);
        this.proyectoService.getProyectosByCliente(this.user.token)
            .pipe(finalize(() => this.cargandoProyectos.set(false)))
            .subscribe({
                next: (data: any) => {
                    this.proyectos.set(data.projects);
                },
                error: (err) => {
                    console.error('Error al cargar proyectos:', err);
                }
            });
    }

    onSearchChange(value: string): void {
        this.searchTerm.set(value);
        this.paginaActual.set(1);
    }

    clearSearch(): void {
        this.searchTerm.set('');
        this.paginaActual.set(1);
    }

    setFiltro(filtro: FiltroEstado): void {
        this.filtroActivo.set(filtro);
        this.paginaActual.set(1);
    }

    resetFilters(): void {
        this.searchTerm.set('');
        this.filtroActivo.set('todos');
        this.paginaActual.set(1);
    }

    cambiarPagina(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPaginas()) {
            this.paginaActual.set(pagina);
        }
    }

    getActiveCount(): number {
        return this.proyectos().filter(p => p.estado === 'activo').length;
    }

    getEstadoLabel(estado: EstadoProyecto | string): string {
        switch (estado) {
            case EstadoProyecto.COMPLETADO:
            case 'completado':
                return 'Completado';
            case EstadoProyecto.ACTIVO:
            case 'activo':
                return 'Activo';
            case EstadoProyecto.ENPROGRESO:
            case 'en_progreso':
                return 'En Progreso';
            case EstadoProyecto.PLANIFICACION:
            case 'planificacion':
                return 'Planificación';
            default:
                return String(estado);
        }
    }

    getAccentGradient(estado: string): string {
        switch (estado) {
            case 'activo':
                return 'linear-gradient(90deg, #3b82f6, #6366f1)';
            case 'completado':
                return 'linear-gradient(90deg, #10b981, #34d399)';
            case 'en_progreso':
                return 'linear-gradient(90deg, #94a3b8, #cbd5e1)';
            case 'planificacion':
                return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            default:
                return 'linear-gradient(90deg, #7c3aed, #6366f1)';
        }
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatDateShort(date: Date): string {
        return new Date(date).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short'
        });
    }

    getPaginasArray(): number[] {
        return Array.from({ length: this.totalPaginas() }, (_, i) => i);
    }
}
