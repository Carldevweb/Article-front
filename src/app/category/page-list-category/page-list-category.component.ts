import { Component } from '@angular/core';
import { Category } from '../../core/models/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-page-list-category',
  standalone: false,
  templateUrl: './page-list-category.component.html',
  styleUrls: ['./page-list-category.component.scss'],
})
export class PageListCategoryComponent {
  categories: Category[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loading = true;
     this.categoryService.refreshCollection(); 

    this.categoryService.collection.subscribe({
      next: (data) => {
        console.log('Catégories reçu : ', data);
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
        this.errorMessage = 'Erreur lors du chargement des catégories';
        this.loading = false;
      },
    });
  }
}
