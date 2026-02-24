import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../../../core/models/article';
import { ArticleService } from '../../../article/services/article.service';

@Component({
  selector: 'app-page-articles-by-category-component',
  standalone: false,
  templateUrl: './page-articles-by-category-component.component.html',
  styleUrl: './page-articles-by-category-component.component.scss'
})
export class PageArticlesByCategoryComponent implements OnInit, OnDestroy {
  private sub = new Subscription();

  articles: Article[] = [];
  loading = true;
  errorMessage: string | null = null;

  categoryId!: number;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.route.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        if (!id || Number.isNaN(id)) return;

        this.categoryId = id;
        this.fetch();
      })
    );
  }

  private fetch(): void {
    this.loading = true;
    this.errorMessage = null;

    this.sub.add(
      this.articleService.getByCategoryId(this.categoryId).subscribe({
        next: (data) => {
          this.articles = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des articles de cette catégorie.';
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
