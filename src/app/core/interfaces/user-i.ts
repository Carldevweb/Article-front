import { LikeI } from './like-i';

export interface UserI {
  id: number;
  userName: string;
  userLastName: string;
  password: string;
  email: string;
  token: string;
  like: LikeI[];
}
