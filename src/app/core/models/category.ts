import { CategoryI } from '../interfaces/category-i';

export class Category implements CategoryI {
  id!: number;
  nomCategorie!: string;
  imageUrl?: string | null;

  constructor(data?: Partial<Category>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Retourne l'URL complète affichable côté front.
   * Ton backend renvoie typiquement "/uploads/categories/xxx.png"
   */
  get imageSrc(): string {
    if (!this.imageUrl) return 'assets/default-category.jpg';
    if (this.imageUrl.startsWith('http')) return this.imageUrl;
    return `http://localhost:8080${this.imageUrl}`;
  }
}