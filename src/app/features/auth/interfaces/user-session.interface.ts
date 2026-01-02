import { User } from "../../users/interfaces/user.interface";

export interface UserSession {
  user: User;
  id_cliente?: number;
  nombre_completo?: string ;
}
