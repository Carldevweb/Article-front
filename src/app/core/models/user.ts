import { LikeI } from '../interfaces/like-i';
import { UserI } from '../interfaces/user-i';

export class User implements UserI {
  id!: number;
  userName!: string;
  userLastName!: string;
  password!: string;
  email!: string;
  token!: string;
  like!: LikeI[];

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
