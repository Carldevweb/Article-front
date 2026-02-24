import { LikeI } from '../interfaces/like-i';
import { Role, UserI } from '../interfaces/user-i';

export class User implements UserI {
  id!: number;
  nomUtilisateur!: string;
  prenomUtilisateur!: string;
  email!: string;
  role!: Role;

  token?: string;
  like?: LikeI[];

  constructor(data?: Partial<User>) {
    if (data) Object.assign(this, data);
  }
}
