import { ArticleI } from '../interfaces/article-i';
import { CategoryI } from '../interfaces/category-i';
import { CommentI } from '../interfaces/comment-i';
import { LikeI } from '../interfaces/like-i';
import { MediaI } from '../interfaces/media-i';

export class Article implements ArticleI {
  id!: number;
  title!: string;
  author!: string;
  content!: string;
  creationDate!: string;
  update!: string;
  comment!: CommentI[];
  like!: LikeI[];
  media?: MediaI[];
  categorie!: CategoryI[];


  constructor(data?: Partial<Article>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
