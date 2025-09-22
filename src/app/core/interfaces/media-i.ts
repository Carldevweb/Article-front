import { ArticleI } from './article-i';

export interface MediaI {
  id: number;
  url: string;
  type: string;

  article: ArticleI;
}
