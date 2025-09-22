import { ArticleI } from './article-i';

export interface CategoryI {
  id: number;
  categoryName: string;

  article: ArticleI;
}
