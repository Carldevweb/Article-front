import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

type UploadMediaResponse = {
  filename: string;
  url: string;
};

type MediaDto = {
  id?: number;
  url: string;
  type?: string;
  articleId: number;
};

type ArticleDto = {
  id: number;
  titre: string;
  contenu: string;
  auteur: string;
  media?: { id: number; url: string; type: string; articleId: number }[];
};

@Component({
  selector: 'app-page-update-media',
  standalone: false,
  templateUrl: './page-update-media.component.html',
  styleUrl: './page-update-media.component.scss',
})
export class PageUpdateMediaComponent implements OnInit, OnDestroy {
  private readonly api = 'http://localhost:8080';

  articleId!: number;
  article: ArticleDto | null = null;

  imagePreviewUrl: string | null = null;

  loadingArticle = false;
  uploading = false;

  errorMessage: string | null = null;
  uploadError: string | null = null;

  private subs: Subscription[] = [];

  get mainImageUrl(): string | null {
    return this.article?.media?.[0]?.url ?? null;
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.articleId || Number.isNaN(this.articleId)) {
      this.errorMessage = "ID d'article invalide.";
      return;
    }
    this.loadArticle();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    if (this.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }

  loadArticle(): void {
    this.loadingArticle = true;
    this.errorMessage = null;

    const sub = this.http.get<ArticleDto>(`${this.api}/articles/${this.articleId}`).subscribe({
      next: (a) => {
        this.article = a;
        this.imagePreviewUrl = a.media?.[0]?.url ?? null;
        this.loadingArticle = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingArticle = false;
        this.errorMessage = "Impossible de charger l'article.";
      },
    });

    this.subs.push(sub);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Fichier invalide : sélectionne une image.';
      input.value = '';
      return;
    }

    if (this.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = URL.createObjectURL(file);

    this.uploadFileAndAttachToArticle(file);

    input.value = '';
  }

  private uploadFileAndAttachToArticle(file: File): void {
    this.uploading = true;
    this.uploadError = null;

    const formData = new FormData();
    formData.append('file', file);

    const oldMediaId = this.article?.media?.[0]?.id;

    const sub1 = this.http.post<UploadMediaResponse>(`${this.api}/medias/upload`, formData).subscribe({
      next: (res) => {
        const payload: MediaDto = {
          url: res.url,
          type: 'image',
          articleId: this.articleId,
        };

        const sub2 = this.http.post(`${this.api}/medias`, payload).subscribe({
          next: () => {
            if (oldMediaId) {
              const sub3 = this.http.delete(`${this.api}/medias/${oldMediaId}`).subscribe({
                next: () => {
                  this.uploading = false;
                  this.loadArticle();
                },
                error: (err) => {
                  console.error(err);
                  this.uploading = false;
                  this.loadArticle();
                },
              });
              this.subs.push(sub3);
            } else {
              this.uploading = false;
              this.loadArticle();
            }
          },
          error: (err) => {
            console.error(err);
            this.uploading = false;
            this.uploadError = "Upload OK, mais association à l'article échouée.";
          },
        });

        this.subs.push(sub2);
      },
      error: (err) => {
        console.error(err);
        this.uploading = false;
        this.uploadError = "Échec de l'upload (backend/CORS/JWT).";
      },
    });

    this.subs.push(sub1);
  }
}
