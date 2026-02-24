import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Category } from '../../core/models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private collection$ = new BehaviorSubject<Category[]>([]);
  private apiUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  private getHttpOptionsJson() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };
  }

  /**
   * IMPORTANT: pour FormData, on NE met PAS Content-Type (le navigateur met le boundary).
   */
  private getHttpOptionsMultipart() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };
  }

  public get collection(): Observable<Category[]> {
    return this.collection$.asObservable();
  }

  public getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map((categories) => categories.map((c) => new Category(c)))
    );
  }

  public refreshCollection(): void {
    this.getAll().subscribe((data) => this.collection$.next(data));
  }

  createCategory(category: Category): Observable<Category> {
    return this.http
      .post<Category>(this.apiUrl, category, this.getHttpOptionsJson())
      .pipe(
        map((c) => new Category(c)),
        tap(() => this.refreshCollection())
      );
  }

  getById(id: number): Observable<Category> {
    return this.http
      .get<Category>(`${this.apiUrl}/${id}`)
      .pipe(map((c) => new Category(c)));
  }

  deleteById(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptionsJson())
      .pipe(tap(() => this.refreshCollection()));
  }

  /**
   * POST /categories/{id}/image  (multipart/form-data)
   * backend attend: @RequestParam("file")
   */
  uploadCategoryImage(categoryId: number, file: File): Observable<Category> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<Category>(
        `${this.apiUrl}/${categoryId}/image`,
        formData,
        this.getHttpOptionsMultipart()
      )
      .pipe(
        map((c) => new Category(c)),
        tap(() => this.refreshCollection())
      );
  }

  /**
   * PUT /categories/{id} (JSON)
   * ⚠️ Renvoie le JWT + refreshCollection
   */
  updateCategorie(id: number, categorie: Category): Observable<Category> {
    return this.http
      .put<Category>(`${this.apiUrl}/${id}`, categorie, this.getHttpOptionsJson())
      .pipe(
        map((c) => new Category(c)),
        tap(() => this.refreshCollection())
      );
  }

  /**
   * OPTIONNEL (recommandé) :
   * Mise à jour UNIQUEMENT de l'image via URL, sans envoyer toute la catégorie
   * PUT /categories/{id} avec { imageUrl: "..." }
   */
  updateCategorieImageUrl(id: number, imageUrl: string): Observable<Category> {
    return this.http
      .put<Category>(
        `${this.apiUrl}/${id}`,
        { imageUrl },
        this.getHttpOptionsJson()
      )
      .pipe(
        map((c) => new Category(c)),
        tap(() => this.refreshCollection())
      );
  }
}