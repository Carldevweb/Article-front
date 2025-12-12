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

  /** Headers avec JWT (uniquement pour endpoints protégés) */
  private getHttpOptionsWithJwt() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };
  }

  /** Headers simples (pour endpoints publics) */
  private getHttpOptionsPublic() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  /** Rafraîchit la liste locale des articles (GET public) */
  public refreshCollection(): void {
    this.http
      .get<any[]>(this.apiUrl, this.getHttpOptionsPublic())
      .pipe(
        map((articles) => articles.map((a) => new Article(a))),
        catchError((error) => {
          console.error('Erreur lors du rafraîchissement des articles :', error);
          return throwError(() => error); // ✅ garder le status HTTP
        })
      )
      .subscribe((data) => this.collection$.next(data));
  }

  /** Observable pour la collection */
  public get collection(): Observable<Article[]> {
    return this.collection$.asObservable();
  }

  /** Récupère un article par ID (GET public) */
  getById(id: number): Observable<Article> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, this.getHttpOptionsPublic())
      .pipe(
        map((a) => new Article(a)),
        catchError((error) => {
          console.error('Erreur lors de la récupération par ID :', error);
          return throwError(() => error); // ✅
        })
      );
  }

  /** Recherche par titre (GET public) */
  getByTitle(titre: string): Observable<Article> {
    return this.http
      .get<any>(`${this.apiUrl}/titre/${titre}`, this.getHttpOptionsPublic())
      .pipe(
        map((a) => new Article(a)),
        catchError((error) => {
          console.error('Erreur lors de la récupération par titre :', error);
          return throwError(() => error); // ✅
        })
      );
  }

  /** Création (protégé -> JWT) */
  createArticle(payload: {
    titre: string;
    contenu: string;
    auteur: string;
  }): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, payload, this.getHttpOptionsWithJwt())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur lors de la création de l'article :", error);
          return throwError(() => error); // ✅ garder 401/403
        })
      );
  }

  /** Mise à jour (protégé -> JWT)
   *  ⚠️ Ton backend attend (titre/contenu/auteur), mais ton modèle Article est (title/content/author).
   *  On fera le mapping propre quand tu attaqueras l'edit.
   */
  updateArticle(payload: {
    id: number;
    titre: string;
    contenu: string;
    auteur: string;
  }): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${payload.id}`, payload, this.getHttpOptionsWithJwt())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur mise à jour de l'article :", error);
          return throwError(() => error); // ✅
        })
      );
  }

  /** Liste complète depuis l’API (GET public) */
  getAllArticles(): Observable<Article[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHttpOptionsPublic()).pipe(
      map((list) => list.map((a) => new Article(a))),
      catchError((error) => {
        console.error('Erreur getAllArticles :', error);
        return throwError(() => error); // ✅
      })
    );
  }

  /** Suppression (protégé -> JWT) */
  deleteArticle(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, this.getHttpOptionsWithJwt())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error('Erreur suppression :', error);
          return throwError(() => error); // ✅
        })
      );
  }
}
