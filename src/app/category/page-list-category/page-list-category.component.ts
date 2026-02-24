import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-list-category',
  standalone: false,
  templateUrl: './page-list-category.component.html',
  styleUrls: ['./page-list-category.component.scss'], // tu peux laisser même si vide
})
export class PageListCategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  errorMessage: string | null = null;

  // UI / Modal
  isModalOpen = false;
  selectedCategory: Category | null = null;

  // Image edit
  fallbackImage = 'https://via.placeholder.com/1200x675?text=Category';
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;

  imageUrlInput = '';
  modalError: string | null = null;
  saving = false;

  constructor(private categoryService: CategoryService, private authService: AuthService ) { }

  ngOnInit(): void {
    this.load();
  }

  reload(): void {
    this.load(true);
  }

  private load(forceRefresh: boolean = false): void {
    this.loading = true;
    this.errorMessage = null;

    if (forceRefresh) {
      this.categoryService.refreshCollection();
    }

    this.categoryService.collection.subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement catégories :', error);
        this.errorMessage = 'Erreur lors du chargement des catégories';
        this.loading = false;
      },
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }

  openEditImage(category: Category): void {
    this.selectedCategory = category;
    this.isModalOpen = true;

    // Reset modal state
    this.modalError = null;
    this.saving = false;
    this.selectedFile = null;
    this.previewImageUrl = null;
    this.imageUrlInput = category.imageSrc || '';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCategory = null;
    this.modalError = null;
    this.saving = false;

    // cleanup preview
    if (this.previewImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImageUrl);
    }
    this.previewImageUrl = null;
    this.selectedFile = null;
    this.imageUrlInput = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // garde-fou taille (ex: 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.modalError = 'Fichier trop lourd (max 5MB).';
      return;
    }

    this.modalError = null;
    this.selectedFile = file;

    // Preview locale
    if (this.previewImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImageUrl);
    }
    this.previewImageUrl = URL.createObjectURL(file);

    // si on upload un fichier, l’URL n’est plus la source principale
    this.imageUrlInput = '';
  }

  onUrlInputChange(): void {
    // si l’utilisateur tape une URL, on annule le fichier
    if (this.imageUrlInput?.trim()) {
      this.selectedFile = null;

      if (this.previewImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.previewImageUrl);
      }
      this.previewImageUrl = this.imageUrlInput.trim();
    } else {
      this.previewImageUrl = null;
    }
  }

  saveImage(): void {
    if (!this.selectedCategory) return;

    this.modalError = null;
    this.saving = true;

    const categoryId = this.selectedCategory.id;

    // Cas 1: upload fichier -> multipart/form-data
    if (this.selectedFile) {
      this.categoryService.uploadCategoryImage(categoryId, this.selectedFile).subscribe({
        next: (updated) => {
          // ✅ on met à jour imageUrl, pas imageSrc
          this.selectedCategory!.imageUrl = updated.imageUrl ?? null;

          this.saving = false;
          this.closeModal();
          this.categoryService.refreshCollection();
        },
        error: (err) => {
          console.error(err);
          this.modalError = "Échec de l'upload de l'image (backend ou endpoint manquant).";
          this.saving = false;
        },
      });
      return;
    }

    // Cas 2: URL -> JSON
    const url = (this.imageUrlInput || '').trim();
    if (!url) {
      this.modalError = "Choisis un fichier ou saisis une URL d'image.";
      this.saving = false;
      return;
    }

    this.categoryService.updateCategorieImageUrl(categoryId, url).subscribe({
      next: (updated) => {
        // ✅ on met à jour imageUrl, pas imageSrc
        this.selectedCategory!.imageUrl = updated.imageUrl ?? null;

        this.saving = false;
        this.closeModal();
        this.categoryService.refreshCollection();
      },
      error: (err) => {
        console.error(err);
        this.modalError = "Échec de la mise à jour de l'URL (backend ou endpoint manquant).";
        this.saving = false;
      },
    });
  }

  canManageCategories(): boolean {
    return this.authService.isAuthenticated() && this.authService.hasAnyRole(['EMPLOYEE', 'ADMIN']);
  }

  supprimerCategorie(category: Category): void {
    if (!category || !category.id) return;

    const confirmation = confirm(
      `Supprimer la catégorie "${category.nomCategorie}" ?`
    );

    if (!confirmation) return;

    this.loading = true;
    this.errorMessage = null;

    this.categoryService.deleteById(category.id).subscribe({
      next: () => {
        this.loading = false;
        this.categoryService.refreshCollection();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Erreur lors de la suppression de la catégorie.';
      },
    });
  }
}