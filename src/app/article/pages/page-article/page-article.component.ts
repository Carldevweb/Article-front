import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../../core/models/article';

@Component({
  selector: 'app-page-article',
  standalone: false,
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.scss'],
})
export class PageArticleComponent {
  article: Article | null = null;


  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID récupéré de l\'URL:', id);  // Ajouter un log ici
    if (id) {
      this.articleService.getById(id).subscribe({
        next: (data) => {
          console.log('Article récupéré:', data); // Ajout du log
          this.article = new Article(data);
          console.log('Article mis à jour:', this.article); // Log ajouté
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l’article :', err);
        },
      });
    }
  }
}
