import { ArticleI } from '../interfaces/article-i';
import { MediaI } from '../interfaces/media-i';

export class Media implements MediaI {
  id!: number;
  url!: string;
  type!: string;
  article!: ArticleI;

  constructor(data?: Partial<Media>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
