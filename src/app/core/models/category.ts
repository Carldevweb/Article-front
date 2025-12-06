import { ArticleI } from '../interfaces/article-i';
import { CategoryI } from '../interfaces/category-i';

export class Category implements CategoryI {
  id!: number;
  nomCategorie!: string;
  article!: ArticleI;

  constructor(data?: Partial<Category>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
