import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Category } from '../../core/models/category';



@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private collection$: BehaviorSubject<Category[]> = new BehaviorSubject<
    Category[]
  >([]);

  private apiUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  public refreshCollection(): void {
    this.http
      .get<Category[]>(`${this.apiUrl}`)
      .pipe(
        map((categorie) => {
          return categorie.map((categorie) => new Category(categorie));
        })
      )
      .subscribe((data) => {
        this.collection$.next(data);
      });
  }

  public get collection(): Observable<Category[]> {
    return this.collection$.asObservable();
  }

  createCategory(category: Category) {
    return this.http.post<any>(`${this.apiUrl}`, category).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }

  getById(id: number) {
    return this.http.get<Category>(`${this.apiUrl}/id/${id}`);
  }

  listCategory(category: Category[]) {
    return this.http
      .get<any>(`${this.apiUrl}/listeCategorie/${category}`)
      .pipe(
        tap(() => {
          this.refreshCollection();
        })
      );
  }

  deleteById(category: Category) {
    return this.http.delete<any>(`${this.apiUrl}/${category.id}`).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }
}
