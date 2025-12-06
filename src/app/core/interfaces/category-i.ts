import { ArticleI } from './article-i';

export interface CategoryI {
  id: number;
  nomCategorie: string;
  article: ArticleI;
}
