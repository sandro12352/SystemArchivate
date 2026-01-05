export interface TaskClient {
    id_cliente_tarea: number;
    cliente:          Cliente;
    tarea:            Tarea;
    estado:           string;
}

export interface Cliente {
    id_cliente:       number;
    id_usuario:       number;
    dni:              string;
    ruc:              null;
    nombres:          string;
    apellidos:        string;
    telefono:         string;
    fecha_nacimiento: Date;
    fecha_registro:   Date;
}

export interface Tarea {
    id_tarea:    number;
    nombre:      string;
    descripcion: string;
    es_defecto:  boolean;
}

export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  SUBIDO = 'subido',
  EN_REVISION = 'en_revision',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado'
}

export interface ArchivoCliente {
  id_archivo_cliente: number;
  ruta: string;
}

export interface TaskClientVM {
  id_cliente_tarea: number;
  estado: EstadoTarea;
  tarea: Tarea;
  archivo_cliente: ArchivoCliente[];

}
