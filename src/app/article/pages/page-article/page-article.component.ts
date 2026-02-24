import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../../core/models/article';
import { CategoryService } from '../../../category/services/category.service';
import { Category } from '../../../core/models/category';

@Component({
  selector: 'app-page-article',
  standalone: false,
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.scss'],
})
export class PageArticleComponent implements OnInit, OnDestroy {
  private sub = new Subscription();

  article: Article | null = null;
  loading = true;
  errorMessage: string | null = null;
  categoryNameById = new Map<number, string>();

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.categoryService.collection.subscribe({
        next: (cats: Category[]) => {
          this.categoryNameById = new Map(cats.map(c => [c.id, c.nomCategorie]));
        }
      })
    );

    this.sub.add(
      this.route.paramMap.subscribe(params => {
        const id = Number(params.get('id'));

        if (!id || Number.isNaN(id)) {
          this.errorMessage = 'ID invalide.';
          this.loading = false;
          return;
        }

        this.loading = true;
        this.errorMessage = null;

        this.sub.add(
          this.articleService.getById(id).subscribe({
            next: (a) => {
              this.article = a;
              this.loading = false;
            },
            error: (err) => {
              console.error(err);
              this.errorMessage = "Impossible de charger l'article.";
              this.loading = false;
            },
          })
        );
      })
    );
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x675?text=Aucune+image';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
