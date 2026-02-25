export interface ProyectoMaterial {
    id_proyecto_material: number;
    id_trabajador: number;
    id_carpeta_material: number;
    nombre: string;
    descripcion: string;
    estado: string;
    ruta: string;
    version: number;
    fecha_subida: Date | string;
    observacion: string | null;
    referencia: string | null;
    tipo: string;
    tamanio: number;
    trabajador: Trabajador;
    carpeta_material: CarpetaMaterial;
}

export interface Trabajador {
    id_trabajador: number;
    id_usuario: number;
    nombres: string;
    apellidos: string;
    fecha_registro: Date | string;
}

export interface CarpetaMaterial {
    id_carpeta_material: number;
    nombre: string;
    descripcion: string | null;
    id_proyecto: number;
    proyecto: ProyectoMini;
}

export interface ProyectoMini {
    id_proyecto: number;
    nombre: string;
    id_cliente: number;
    estado: string;
    prioridad: string;
    cantidad_material: number;
    descripcion: string;
    plan_grabacion_url: string;
    fecha_registro: Date | string;
    fecha_termino: Date | string;
}
