import { Role } from '../auth/role.type';


export interface AdminUserDto {
  id: number;
  email: string;
  nomUtilisateur: string;
  prenomUtilisateur: string;
  role: Role;
}