export interface User {
    id_usuario:              number;
    email:           string;
    id_rol:             number;
    nombre_completo?: string;
    foto_perfil?:     string;
}