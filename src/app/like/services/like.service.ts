import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { Like } from '../core/models/like';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private collection$: BehaviorSubject<Like[]> = new BehaviorSubject<Like[]>(
    []
  );

  private urlApi = 'http://localhost:8080/favoris';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  refreshCollection() {
    this.http
      .get<Like[]>(`${this.urlApi}`)
      .pipe(
        map((like) => {
          return like.map((like) => new Like(like));
        })
      )
      .subscribe((data) => {
        this.collection$.next(data);
      });
  }

  public get collection(): Subject<Like[]> {
    return this.collection$;
  }

  createLike(like: Like) {
    return this.http.post<Like[]>(`${this.urlApi}`, like).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }

  deleteLike(like: Like) {
    return this.http.delete<any>(`${this.urlApi}/${like.id}`).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }
}
