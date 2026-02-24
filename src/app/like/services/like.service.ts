import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Like } from '../../core/models/like';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private collection$: BehaviorSubject<Like[]> = new BehaviorSubject<Like[]>(
    []
  );

  private urlApi = 'http://localhost:8080/favoris';

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isAuthenticated()) {
      this.refreshCollection();
    } else {
      this.collection$.next([]);
    }
  }

  refreshCollection(): void {
    this.http.get<Like[]>(this.urlApi).pipe(
      map(likes => likes.map(l => new Like(l)))
    ).subscribe({
      next: data => this.collection$.next(data),
      error: err => {
        console.error('refreshCollection failed', err);
        this.collection$.next([]); // ou garder l'ancien si tu préfères
      }
    });
  }


  public get collection(): Observable<Like[]> {
    return this.collection$.asObservable();
  }

  createLike(payload: { articleId: number }): Observable<Like> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Like>(this.urlApi, payload, { headers }).pipe(
      map(res => new Like(res)),
      tap(() => this.refreshCollection())
    );
  }


  deleteLike(likeId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${likeId}`).pipe(
      tap(() => this.refreshCollection())
    );
  }
}
