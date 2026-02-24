import { LikeI } from './like-i';

export type Role = 'ADMIN' | 'EMPLOYEE' | 'USER'; // ajoute/enlève selon ton enum backend

export interface UserI {
  id: number;
  nomUtilisateur: string;
  prenomUtilisateur: string;
  email: string;
  role: Role;

  token?: string;      // stocké côté front (localStorage), pas forcément renvoyé par /profil
  like?: LikeI[];      // optionnel si ton endpoint profil ne l’envoie pas
}
