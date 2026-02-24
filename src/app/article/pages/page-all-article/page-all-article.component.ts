import { Component, OnInit } from '@angular/core';
import { Article } from '../../../core/models/article';
import { ArticleService } from '../../services/article.service';
import { LikeService } from '../../../like/services/like.service';
import { AuthService } from '../../../core/services/auth.service';
import { Like } from '../../../core/models/like';

@Component({
  selector: 'app-page-all-article',
  standalone: false,
  templateUrl: './page-all-article.component.html',
  styleUrls: ['./page-all-article.component.scss'],
})
export class PageAllArticleComponent implements OnInit {
  articles: Article[] = [];
  likes: Like[] = [];

  loading = false;
  errorMessage: string | null = null;

  private readonly apiBaseUrl = 'http://localhost:8080';
  fallbackImage = 'assets/default-article.jpg';

  constructor(
    private articleService: ArticleService,
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.articleService.collection.subscribe({
      next: (data) => {
        this.articles = data.slice(0, 10);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des articles';
        this.loading = false;
      },
    });

    this.likeService.collection.subscribe((likes) => {
      this.likes = likes;
    });

    this.articleService.refreshCollection();
  }

  canManageArticles(): boolean {
    return this.authService.isAuthenticated() && this.authService.hasAnyRole(['ADMIN']);
  }

  getDisplayImage(article: Article): string {
    // ton modèle Article expose déjà media[]
    const raw = (article as any)?.media?.[0]?.url || (article as any)?.imageUrl || '';

    if (!raw) return this.fallbackImage;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/')) return `${this.apiBaseUrl}${raw}`;
    return `${this.apiBaseUrl}/${raw}`;
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = this.fallbackImage;
  }

  isLiked(articleId: number): boolean {
    return this.likes.some((l) => l.articleId === articleId);
  }

  getLike(articleId: number) {
    return this.likes.find((l) => l.articleId === articleId);
  }

  toggleLike(articleId: number): void {
    const like = this.getLike(articleId);

    if (like) {
      this.likeService.deleteLike(like.id).subscribe();
    } else {
      this.likeService.createLike({ articleId }).subscribe();
    }
  }

  deleteArticle(id: number): void {
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'Non authentifié. Connecte-toi.';
      return;
    }

    if (!this.authService.hasAnyRole(['ADMIN'])) {
      this.errorMessage = 'Accès refusé (rôle insuffisant).';
      return;
    }

    const ok = confirm('Confirmer la suppression de cet article ?');
    if (!ok) return;

    this.loading = true;
    this.errorMessage = null;

    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        this.articles = this.articles.filter((a) => a.id !== id);
        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 401) this.errorMessage = 'Non authentifié. Connecte-toi.';
        else if (err?.status === 403) this.errorMessage = 'Accès refusé (rôle insuffisant).';
        else this.errorMessage = 'Erreur lors de la suppression.';
        this.loading = false;
      },
    });
  }
}