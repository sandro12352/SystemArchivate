export interface Client {
    id_cliente:       number;
    id_usuario:       number;
    dni?:              string;
    ruc?:              string;
    nombres:          string;
    apellidos:        string;
    telefono:         string;
    fecha_nacimiento: Date;
    fecha_registro:   Date;
}
