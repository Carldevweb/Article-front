import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
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

  private getHttpOptionsWithJwt() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };
  }

  private getHttpOptionsPublic() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  /**
   * ✅ IMPORTANT: pour FormData, on NE met PAS Content-Type
   * (le navigateur met le boundary tout seul).
   */
  private getHttpOptionsMultipart() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };
  }

  public get collection(): Observable<Article[]> {
    return this.collection$.asObservable();
  }

  public refreshCollection(): void {
    this.http
      .get<any[]>(this.apiUrl, this.getHttpOptionsPublic())
      .pipe(
        map((articles) => articles.map((a) => this.mapApiToArticle(a))),
        catchError((error) => {
          console.error('Erreur lors du rafraîchissement des articles :', error);
          return throwError(() => error);
        })
      )
      .subscribe((data) => this.collection$.next(data));
  }

  getById(id: number): Observable<Article> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, this.getHttpOptionsPublic())
      .pipe(
        map((a) => this.mapApiToArticle(a)),
        catchError((error) => {
          console.error('Erreur lors de la récupération par ID :', error);
          return throwError(() => error);
        })
      );
  }

  getByTitle(titre: string): Observable<Article> {
    return this.http
      .get<any>(`${this.apiUrl}/titre/${titre}`, this.getHttpOptionsPublic())
      .pipe(
        map((a) => this.mapApiToArticle(a)),
        catchError((error) => {
          console.error('Erreur lors de la récupération par titre :', error);
          return throwError(() => error);
        })
      );
  }

  createArticle(payload: {
    titre: string;
    contenu: string;
    categoriesIds: number[];
  }): Observable<void> {
    return this.http
      .post<void>(this.apiUrl, payload, this.getHttpOptionsWithJwt())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur lors de la création de l'article :", error);
          return throwError(() => error);
        })
      );
  }

  /**
   * POST /articles/{id}/image (multipart/form-data)
   * backend attend: @RequestParam("file")
   */
  uploadArticleImage(articleId: number, file: File): Observable<Article> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<any>(`${this.apiUrl}/${articleId}/image`, formData, this.getHttpOptionsMultipart())
      .pipe(
        map((a) => this.mapApiToArticle(a)),
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur upload image article :", error);
          return throwError(() => error);
        })
      );
  }

  /**
   * ✅ Correspond EXACTEMENT à ton save():
   * updateArticle({ id, titre, contenu, auteur })
   */
  updateArticle(payload: {
    id: number;
    titre: string;
    contenu: string;
    auteur: string;
  }): Observable<Article> {
    return this.http
      .put<any>(`${this.apiUrl}/${payload.id}`, payload, this.getHttpOptionsWithJwt())
      .pipe(
        map((a) => this.mapApiToArticle(a)),
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur mise à jour de l'article :", error);
          return throwError(() => error);
        })
      );
  }

  getAllArticles(): Observable<Article[]> {
    return this.http
      .get<any[]>(this.apiUrl, this.getHttpOptionsPublic())
      .pipe(
        map((list) => list.map((a) => this.mapApiToArticle(a))),
        catchError((error) => {
          console.error('Erreur getAllArticles :', error);
          return throwError(() => error);
        })
      );
  }

  getByCategoryId(categoryId: number): Observable<Article[]> {
    return this.http
      .get<any[]>(
        `http://localhost:8080/categories/${categoryId}/articles`,
        this.getHttpOptionsPublic()
      )
      .pipe(
        map((list) => list.map((a) => this.mapApiToArticle(a))),
        catchError((err) => throwError(() => err))
      );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptionsWithJwt())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error('Erreur suppression :', error);
          return throwError(() => error);
        })
      );
  }

  private mapApiToArticle(a: any): Article {
    return new Article({
      id: a.id,
      title: a.title ?? a.titre ?? '',
      content: a.content ?? a.contenu ?? '',
      author: a.author ?? a.auteur ?? '',
      creationDate: a.creationDate ?? a.dateCreation ?? '',
      update: a.update ?? a.miseAJour ?? '',
      comment: a.comment ?? a.commentaire ?? a.commentaires ?? [],
      like: a.like ?? a.likes ?? [],
      // supporte media OU medias
      media: a.media ?? a.medias ?? [],
      categoriesIds: a.categoriesIds ?? [],
    });
  }
}