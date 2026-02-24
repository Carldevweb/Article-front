import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Category } from '../../core/models/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-page-edit-category',
  standalone: false,
  templateUrl: './page-edit-category.component.html',
  styleUrls: ['./page-edit-category.component.scss'],
})
export class PageEditCategoryComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  categoryId!: number;
  category!: Category;

  loading = false;
  saving = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  // image
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      nomCategorie: ['', [Validators.required, Validators.minLength(2)]],
      imageUrl: [''],
    });

    this.loadCategory();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.cleanupPreview();
  }

  private loadCategory(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const s = this.categoryService.getById(this.categoryId).subscribe({
      next: (c) => {
        this.category = c;

        this.form.patchValue({
          nomCategorie: c.nomCategorie ?? '',
          imageUrl: c.imageUrl ?? '',
        });

        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = 'Impossible de charger la catégorie.';
        this.loading = false;
      },
    });

    this.sub.add(s);
  }

  get f() {
    return this.form.controls;
  }

  onBack(): void {
    this.router.navigate(['/categories']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // garde-fou (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'Fichier trop lourd (max 5MB).';
      input.value = '';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.selectedFile = file;

    this.cleanupPreview();
    this.previewUrl = URL.createObjectURL(file);

    // reset input pour pouvoir re-sélectionner le même fichier
    input.value = '';
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.cleanupPreview();
    this.previewUrl = null;
  }

  private cleanupPreview(): void {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  getPreviewSrc(): string {
    // Priorité : fichier local -> URL saisie -> image backend existante -> placeholder via modèle
    const urlInput = (this.form?.value?.imageUrl as string) || '';
    if (this.previewUrl) return this.previewUrl;
    if (urlInput.trim()) return urlInput.trim();
    return this.category?.imageSrc || 'assets/default-category.jpg';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // ✅ évite le warning : on gère le disabled côté TS
    this.form.disable();

    this.saving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const payload = new Category({
      ...this.category,
      nomCategorie: (this.form.value.nomCategorie as string).trim(),
      imageUrl: ((this.form.value.imageUrl as string) || '').trim() || null,
    });

    const s1 = this.categoryService.updateCategorie(this.categoryId, payload).subscribe({
      next: (updated) => {
        this.category = updated;

        // 2) Upload fichier si sélectionné
        if (this.selectedFile) {
          const s2 = this.categoryService.uploadCategoryImage(this.categoryId, this.selectedFile).subscribe({
            next: (updatedAfterUpload) => {
              this.category = updatedAfterUpload;
              this.category.imageUrl = updatedAfterUpload.imageUrl ?? null;

              this.selectedFile = null;
              this.cleanupPreview();
              this.previewUrl = null;

              this.saving = false;
              this.form.enable();

              this.categoryService.refreshCollection();

              // ✅ redirection après succès (données + image)
              this.router.navigate(['/categories']);
            },
            error: (e) => {
              console.error(e);
              this.saving = false;
              this.form.enable();
              this.errorMessage =
                "Les données ont été enregistrées, mais l'upload de l'image a échoué.";
            },
          });

          this.sub.add(s2);
          return;
        }

        // ✅ succès sans upload
        this.saving = false;
        this.form.enable();

        this.categoryService.refreshCollection();

        // ✅ redirection après succès (données seules)
        this.router.navigate(['/categories']);
      },
      error: (e) => {
        console.error(e);
        this.saving = false;
        this.form.enable();
        this.errorMessage = "Échec de la mise à jour de la catégorie.";
      },
    });

    this.sub.add(s1);
  }
}