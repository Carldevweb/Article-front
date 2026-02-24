import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../../core/models/category';

@Component({
  selector: 'app-page-create-category',
  standalone: false,
  templateUrl: './page-create-category.component.html',
  styleUrls: ['./page-create-category.component.scss'],
})
export class PageCreateCategoryComponent {
  newCategoryName = '';

  selectedFile: File | null = null;

  isSubmitting = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(private categoryService: CategoryService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMsg = null;
    this.successMsg = null;

    if (!file) {
      this.selectedFile = null;
      return;
    }

    // Optionnel : garde-fous identiques à l’admin qu’on a fait
    const okTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!okTypes.includes(file.type)) {
      this.errorMsg = 'Format image non supporté (png, jpeg, webp)';
      input.value = '';
      this.selectedFile = null;
      return;
    }

    const max = 5 * 1024 * 1024;
    if (file.size > max) {
      this.errorMsg = 'Image trop lourde (max 5MB)';
      input.value = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.errorMsg = null;
    this.successMsg = null;
  }

  createCategory(): void {
    const name = this.newCategoryName.trim();
    this.errorMsg = null;
    this.successMsg = null;

    if (name.length < 2) {
      this.errorMsg = 'Nom trop court';
      return;
    }

    this.isSubmitting = true;

    const payload = new Category({ nomCategorie: name });

    this.categoryService.createCategory(payload).subscribe({
      next: (created) => {
        // Pas d’image => terminé
        if (!this.selectedFile) {
          this.successMsg = 'Catégorie créée';
          this.newCategoryName = '';
          this.isSubmitting = false;
          return;
        }

        // Image => upload
        this.categoryService.uploadCategoryImage(created.id, this.selectedFile).subscribe({
          next: () => {
            this.successMsg = 'Catégorie créée + image uploadée';
            this.newCategoryName = '';
            this.selectedFile = null;
            this.isSubmitting = false;
          },
          error: (err) => {
            // la catégorie existe, mais l’upload a échoué
            this.errorMsg = err?.error?.message || 'Catégorie créée, mais échec upload image';
            this.newCategoryName = '';
            this.selectedFile = null;
            this.isSubmitting = false;
          },
        });
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Erreur création catégorie';
        this.isSubmitting = false;
      },
    });
  }
}