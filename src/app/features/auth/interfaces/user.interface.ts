export interface ResponseLogin {
    token: string;
    user:  User;
}

export interface User {
    id:              number;
    email:           string;
    rol:             number;
    nombre_completo: string;
    foto_perfil:     string;
}
