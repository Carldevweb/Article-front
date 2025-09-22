import { ArticleI } from './article-i';

export interface CommentI {
  id: number;
  content: string;
  author: string;
  creationDate: string;

  article: ArticleI;
}
