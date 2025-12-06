import { LikeI } from './like-i';

export interface UserI {
  id: number;
  nomUtilisateur: string;
  prenomUtilisateur: string;
  password: string;
  email: string;
  token: string;
  like: LikeI[];
}
