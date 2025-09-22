import { LikeI } from '../interfaces/like-i';
import { UserI } from '../interfaces/user-i';

export class Like implements LikeI {
  id!: number;
  creationDate!: string;
  user!: UserI;

  constructor(data?: Partial<Like>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
