import { CategoryI } from './category-i';
import { CommentI } from './comment-i';
import { LikeI } from './like-i';
import { MediaI } from './media-i';

export interface ArticleI {
  id: number;
  title: string;
  author: string;
  content: string;
  creationDate: string;
  update: string;
  comment: CommentI[];
  like: LikeI[];
  media?: MediaI[];
  categorie: CategoryI[];
}
