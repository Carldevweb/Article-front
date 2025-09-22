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
  private collection$: BehaviorSubject<Article[]> = new BehaviorSubject<
    Article[]
  >([]);
  private apiUrl = 'http://localhost:8080/articles';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  private getHttpOptions() {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  public refreshCollection(): void {
    this.http
      .get<Article[]>(this.apiUrl, this.getHttpOptions())
      .pipe(
        map((articles) => articles.map((article) => new Article(article))),
        catchError((error) => {
          console.error(
            'Erreur lors du rafraîchissement des articles :',
            error
          );
          return throwError(
            () => new Error('Erreur lors de la récupération des articles')
          );
        })
      )
      .subscribe((data) => this.collection$.next(data));
  }

  public get collection(): Observable<Article[]> {
    return this.collection$.asObservable();
  }

  getById(id: number): Observable<Article> {
    const article = this.collection$.value.find((a) => a.id === id);
    console.log("Recherche de l'article avec id:", id); // Ajout d'un log ici
    if (article) {
      return of(article);
    } else {
      return throwError(
        () => new Error('Article non trouvé dans la collection')
      );
    }
  }

  getByTitle(titre: string): Observable<Article> {
    return this.http.get<Article>(
      `${this.apiUrl}/titre/${titre}`,
      this.getHttpOptions()
    );
  }

  createArticle(col: Article): Observable<any> {
    return this.http.post<any>(this.apiUrl, col, this.getHttpOptions()).pipe(
      tap(() => this.refreshCollection()),
      catchError((error) => {
        console.error("Erreur lors de la création de l'article :", error);
        return throwError(
          () => new Error("Erreur lors de la création de l'article")
        );
      })
    );
  }

  updateArticle(col: Article): Observable<Article> {
    if (!col.id) {
      throw new Error("L'identifiant de l'article n'existe pas");
    }
    return this.http
      .put<Article>(`${this.apiUrl}/${col.id}`, col, this.getHttpOptions())
      .pipe(
        tap((articleMisAJour) => {
          console.log('Article mis à jour :', articleMisAJour);
          const collectionMisAJour = this.collection$.value.map((article) =>
            article.id === articleMisAJour.id
              ? new Article(articleMisAJour)
              : article
          );
          this.collection$.next(collectionMisAJour);
        }),
        catchError((error) => {
          console.error("Erreur lors de la mise à jour de l'article :", error);
          return throwError(
            () => new Error("Erreur lors de la mise à jour de l'article")
          );
        })
      );
  }


getAllArticles(): Observable<Article[]> {
  return this.http.get<Article[]>(`${this.apiUrl}/articles`);
}


  public deleteArticle(col: Article): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${col.id}`, this.getHttpOptions())
      .pipe(
        tap(() => this.refreshCollection()),
        catchError((error) => {
          console.error("Erreur lors de la suppression de l'article :", error);
          return throwError(
            () => new Error("Erreur lors de la suppression de l'article")
          );
        })
      );
  }
}
