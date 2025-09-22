import { UserI } from "./user-i";

export interface LikeI {
  id: number;
  creationDate: string;

  user:UserI;
}
