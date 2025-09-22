import { ArticleI } from '../interfaces/article-i';
import { CommentI } from '../interfaces/comment-i';

export class Comment implements CommentI {
  id!: number;
  content!: string;
  author!: string;
  creationDate!: string;
  article!: ArticleI;

  constructor(data?: Partial<Comment>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
