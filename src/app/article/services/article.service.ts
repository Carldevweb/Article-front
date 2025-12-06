import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Article } from '../../core/models/article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private collection$ = new BehaviorSubject<Article[]>([]);
  private apiUrl = 'http://localhost:8080/articles';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  /** Construction des headers avec JWT */
  private getHttpOptions() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  /** Rafraîchit la liste locale des articles */
  public refreshCollection(): void {
    this.http
      .get<Article[]>(this.apiUrl, this.getHttpOptions())
      .pipe(
        map((articles) => articles.map((a) => new Article(a))),
        catchError((error) => {
          console.error('Erreur lors du rafraîchissement des articles :', error);
          return throwError(
            () => new Error('Erreur lors de la récupération des articles')
          );
        })
      )
      .subscribe((data) => this.collection$.next(data));
  }

  /** Observable pour la collection */
  public get collection(): Observable<Article[]> {
    return this.collection$.asObservable();
  }

  /** Récupère un article depuis l’API */
  getById(id: number): Observable<Article> {
    return this.http
      .get<Article>(`${this.apiUrl}/${id}`, this.getHttpOptions())
      .pipe(
        map((a) => new Article(a)),
        catchError((error) => {
          console.error('Erreur lors de la récupération par ID :', error);
          return throwError(() => new Error('Article introuvable'));
        })
      );
  }

  /** Recherche par titre */
  getByTitle(titre: string): Observable<Article> {
    return this.http
      .get<Article>(`${this.apiUrl}/titre/${titre}`, this.getHttpOptions())
      .pipe(
        map((a) => new Article(a)),
        catchError((error) => {
          console.error("Erreur lors de la récupération par titre :", error);
          return throwError(() => new Error('Article non trouvé'));
        })
      );
  }

  /** Création */
  createArticle(article: Article): Observable<Article> {
    return this.http
      .post<Article>(this.apiUrl, article, this.getHttpOptions())
      .pipe(
        tap(() => this.refreshCollection()),
        map((a) => new Article(a)),
        catchError((error) => {
          console.error("Erreur lors de la création de l'article :", error);
          return throwError(() => new Error("Erreur création article"));
        })
      );
  }

  /** Mise à jour */
  updateArticle(article: Article): Observable<Article> {
    if (!article.id) {
      throw new Error("L'identifiant de l'article est manquant");
    }

    return this.http
      .put<Article>(`${this.apiUrl}/${article.id}`, article, this.getHttpOptions())
      .pipe(
        tap((updated) => {
          const updatedCollection = this.collection$.value.map((a) =>
            a.id === updated.id ? new Article(updated) : a
          );
          this.collection$.next(updatedCollection);
        }),
        map((a) => new Article(a)),
        catchError((error) => {
          console.error("Erreur mise à jour de l'article :", error);
          return throwError(() => new Error("Erreur mise à jour"));
        })
      );
  }

  /** Liste complète depuis l’API (sans affecter le BehaviorSubject) */
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl, this.getHttpOptions()).pipe(
      map((list) => list.map((a) => new Article(a))),
      catchError((error) => {
        console.error('Erreur getAllArticles :', error);
        return throwError(() => new Error('Erreur lors de la récupération'));
      })
    );
  }

  /** Suppression */
  deleteArticle(article: Article): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${article.id}`, this.getHttpOptions())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur suppression :", error);
          return throwError(() => new Error("Erreur suppression article"));
        })
      );
  }
}
