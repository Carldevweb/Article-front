import { Component } from '@angular/core';
import { Article } from '../../../core/models/article';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-page-all-article',
  standalone: false,
  templateUrl: './page-all-article.component.html',
  styleUrls: ['./page-all-article.component.scss'],
})
export class PageAllArticleComponent {
  articles: Article[] = []; // Pour stocker les articles récupérés
  loading = false; // Pour indiquer si les articles sont en cours de chargement
  errorMessage: string | null = null; // Pour afficher un message d'erreur en cas de problème

  constructor(private articleService: ArticleService) {}

  getImageUrl(article: Article): string {
    return article.media?.[0]?.url || 'https://via.placeholder.com/150';
  }

  ngOnInit(): void {
    this.loading = true;
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        this.articles = data.slice(0, 10); // Remplir les articles avec les données récupérées
        this.loading = false; // Cacher l'indicateur de chargement
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles :', error);
        this.errorMessage = 'Erreur lors du chargement des articles'; // Afficher le message d'erreur
        this.loading = false;
      },
    });
  }
}
