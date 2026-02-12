export interface PlanMarketing {
    id_plan_marketing: number;
    id_cliente: number;
    ruta_pdf: string;
    nombre_archivo: string;
    fecha_envio: Date;
    estado: EstadoPlanMarketing;
    observaciones_cliente?: string;
    fecha_revision?: Date;
}

export enum EstadoPlanMarketing {
    PENDIENTE = 'pendiente',
    REVISADO = 'revisado'
}

export interface Proyecto {
    id_proyecto: number;
    id_cliente: number;
    nombre: string;
    descripcion?: string;
    estado: EstadoProyecto;
    fecha_inicio: Date;
    fecha_fin?: Date;
}

export enum EstadoProyecto {
    ACTIVO = 'activo',
    EN_PAUSA = 'en_pausa',
    FINALIZADO = 'finalizado'
}
