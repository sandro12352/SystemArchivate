export interface User {
    id_usuario:              number;
    email:           string;
    rol:             Rol;
    foto_perfil?:     string;
}


export interface Rol{
    id_rol: number;
    nombre: string;
}