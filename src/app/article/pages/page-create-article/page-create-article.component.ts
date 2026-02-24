import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../../category/services/category.service';
import { Category } from '../../../core/models/category';
import { MediaService } from '../../../media/services/media.service';
import { Media } from '../../../core/models/media';

@Component({
  selector: 'app-page-create-article',
  standalone: false,
  templateUrl: './page-create-article.component.html',
  styleUrls: ['./page-create-article.component.scss'],
})
export class PageCreateArticleComponent implements OnInit {
  errorMsg: string | null = null;
  isSubmitting = false;

  categories: Category[] = [];
  selectedCategoryIds: number[] = [];

  // image
  selectedFile: File | null = null;

  formFields = [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      placeholder: 'Entrer le titre',
    },
    {
      name: 'contenu',
      type: 'textarea',
      label: 'Contenu',
      placeholder: "Contenu de l'article",
    },
  ];

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private mediaService: MediaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.collection.subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.errorMsg = 'Impossible de charger les catégories.'),
    });
  }

  toggleCategory(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedCategoryIds.includes(id)) {
        this.selectedCategoryIds.push(id);
      }
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter((x) => x !== id);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMsg = 'Fichier trop lourd (max 5MB).';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    input.value = '';
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  onFormSubmit(formData: any) {
    this.errorMsg = null;

    if (!formData?.titre || !formData?.contenu) {
      this.errorMsg = 'Titre et contenu sont obligatoires.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      titre: formData.titre,
      contenu: formData.contenu,
      categoriesIds: this.selectedCategoryIds,
    };

    // IMPORTANT : ton backend renvoie ArticleDto -> on récupère l'id créé
    this.articleService.createArticle(payload).subscribe({
      next: (createdArticle: any) => {
        const articleId = Number(createdArticle?.id);

        // Si pas d'image -> fin
        if (!this.selectedFile || !articleId) {
          this.router.navigate(['/articles']);
          return;
        }

        // 1) upload => url
        this.mediaService.upload(this.selectedFile).subscribe({
          next: (uploadRes) => {
            // 2) create media en base (lié à l'article)
            const media = new Media({
              url: uploadRes.url,
              filename: uploadRes.filename,
              articleId: articleId, // adapte si ton modèle diffère
            } as any);

            this.mediaService.createMedia(media).subscribe({
              next: () => this.router.navigate(['/articles']),
              error: (e) => {
                console.error(e);
                this.errorMsg =
                  "Article créé, mais échec de l'enregistrement du media.";
                this.isSubmitting = false;
              },
            });
          },
          error: (e) => {
            console.error(e);
            this.errorMsg = "Article créé, mais échec de l'upload de l'image.";
            this.isSubmitting = false;
          },
        });
      },
      error: (err) => {
        if (err?.status === 401) this.errorMsg = 'Non authentifié. Connecte-toi.';
        else if (err?.status === 403) this.errorMsg = 'Accès refusé (rôle insuffisant).';
        else this.errorMsg = "Erreur lors de la création de l'article.";
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  onFieldRemoved(fieldName: string) {
    this.formFields = this.formFields.filter((field) => field.name !== fieldName);
  }
}