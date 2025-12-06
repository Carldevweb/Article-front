import { HttpClient } from '@angular/common/http';
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
  /** Rafraîchir la collection de catégories */
  public refreshCollection(): void {
    this.http
      .get<Category[]>(`${this.apiUrl}`)
      .pipe(map((categories) => categories.map((c) => new Category(c))))
      .subscribe((data) => this.collection$.next(data));
  }

  /** Observable en lecture */
  public get collection(): Observable<Category[]> {
    return this.collection$.asObservable();
  }

  /** Création d'une catégorie */
  createCategory(category: Category): Observable<Category> {
    return this.http
      .post<Category>(`${this.apiUrl}`, category)
      .pipe(tap(() => this.refreshCollection()));
  }

  /** Récupération par ID */
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/id/${id}`);
  }

  /** Liste de toutes les catégories */
  listCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  /** Suppression */
  deleteById(category: Category): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/id/${category.id}`)
      .pipe(tap(() => this.refreshCollection()));
  }
}
