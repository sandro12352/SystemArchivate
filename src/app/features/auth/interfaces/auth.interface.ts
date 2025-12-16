import { User } from "../../users/interfaces/user.interface";

export interface ResponseLogin {
    token: string;
    user:  User;
}


