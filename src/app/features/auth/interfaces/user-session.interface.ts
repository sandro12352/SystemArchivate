import { User } from "../../users/interfaces/user.interface";

export interface UserSession {
  user: User;
  nombre_completo?: string ;
}
