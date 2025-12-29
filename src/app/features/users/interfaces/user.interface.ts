export interface User {
    id_usuario:              number;
    email:           string;
    rol:             Rol;
    nombre_completo?: string;
    foto_perfil?:     string;
}


export interface Rol{
    id_rol: number;
    nombre: string;
}