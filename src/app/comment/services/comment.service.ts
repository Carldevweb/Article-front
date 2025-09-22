import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../core/models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private collection$: BehaviorSubject<Comment[]> = new BehaviorSubject<
    Comment[]
  >([]);

  private urlApi = 'http://localhost:8080/commentaires';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  public refreshCollection(): void {
    this.http
      .get<Comment[]>(`${this.urlApi}`)
      .pipe(
        map((comment) => {
          return comment.map((comment) => new Comment(comment));
        })
      )
      .subscribe((data) => {
        this.collection$.next(data);
      });
  }

  public get collection(): Subject<Comment[]> {
    return this.collection$;
  }

  public set collection(col: BehaviorSubject<Comment[]>) {
    this.collection$ = col;
  }

  createComment(col: Comment) {
    return this.http.post<Comment[]>(`${this.urlApi}`, col).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }

  deleteComment(comment: Comment) {
    return this.http.delete<any>(`${this.urlApi}/${comment.id}`).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }
}
