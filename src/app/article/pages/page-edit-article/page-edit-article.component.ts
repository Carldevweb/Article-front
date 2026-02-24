import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../../core/models/article';
import { MediaService } from '../../../media/services/media.service';

@Component({
  selector: 'app-page-edit-article',
  standalone: false,
  templateUrl: './page-edit-article.component.html',
  styleUrls: ['./page-edit-article.component.scss'],
})
export class PageEditArticleComponent implements OnInit {
  form!: FormGroup;
  articleId!: number;

  loading = false;
  saving = false;
  erreur = '';
  successMessage: string | null = null;

  article: Article | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  fallbackImage = 'assets/default-article.jpg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || Number.isNaN(id)) {
      this.router.navigate(['/articles']);
      return;
    }
    this.articleId = id;

    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      contenu: ['', [Validators.required, Validators.minLength(10)]],
      auteur: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.chargerArticle();
  }

  onBack(): void {
    this.router.navigate(['/articles']);
  }

  private chargerArticle(): void {
    this.loading = true;
    this.erreur = '';
    this.successMessage = null;

    this.articleService.getById(this.articleId).subscribe({
      next: (article: Article) => {
        this.loading = false;
        this.article = article;

        this.form.patchValue({
          titre: (article as any).titre ?? (article as any).title ?? '',
          contenu: (article as any).contenu ?? (article as any).content ?? '',
          auteur: (article as any).auteur ?? (article as any).author ?? '',
        });
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.erreur = "Impossible de charger l'article.";
      },
    });
  }

  get mainImageUrl(): string | null {
    return this.article?.media?.[0]?.url ?? null;
  }

  get existingMediaId(): number | null {
    return this.article?.media?.[0]?.id ?? null;
  }

  getPreviewSrc(): string {
    if (this.previewUrl) return this.previewUrl;

    const raw = this.mainImageUrl;
    if (!raw) return this.fallbackImage;

    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/')) return `http://localhost:8080${raw}`;
    return `http://localhost:8080/${raw}`;
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = this.fallbackImage;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.erreur = 'Fichier trop lourd (max 5MB).';
      input.value = '';
      return;
    }

    this.erreur = '';
    this.successMessage = null;
    this.selectedFile = file;

    this.cleanupPreview();
    this.previewUrl = URL.createObjectURL(file);

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

  private handleMediaError(message: string, err?: any): void {
    console.error(err);
    this.loading = false;
    this.saving = false;
    this.form.enable();
    this.erreur = message;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.loading = true;
    this.erreur = '';
    this.successMessage = null;

    this.form.disable();

    const payload = {
      id: this.articleId,
      titre: (this.form.value.titre as string).trim(),
      contenu: (this.form.value.contenu as string).trim(),
      auteur: (this.form.value.auteur as string).trim(),
    };

    this.articleService.updateArticle(payload).subscribe({
      next: () => {
        if (!this.selectedFile) {
          this.afterSuccess();
          return;
        }

        this.mediaService.upload(this.selectedFile).subscribe({
          next: (uploadRes) => {
            const mediaPayload: any = {
              url: uploadRes.url,
              type: 'IMAGE',
              articleId: this.articleId,
            };

            const mediaId = this.existingMediaId;

            if (mediaId) {
              this.mediaService.updateMedia(mediaId, mediaPayload).subscribe({
                next: () => this.afterSuccess(),
                error: (e) => this.handleMediaError('Erreur mise à jour media.', e),
              });
              return;
            }

            this.mediaService.createMedia(mediaPayload).subscribe({
              next: () => this.afterSuccess(),
              error: (e) => this.handleMediaError('Erreur création media.', e),
            });
          },
          error: (e) => this.handleMediaError("Erreur upload image.", e),
        });
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.saving = false;
        this.form.enable();
        this.erreur = 'Échec de la mise à jour.';
      },
    });
  }

  private afterSuccess(): void {
    this.loading = false;
    this.saving = false;
    this.form.enable();

    this.selectedFile = null;
    this.cleanupPreview();
    this.previewUrl = null;

    this.articleService.refreshCollection();
    this.router.navigate(['/articles']);
  }
}