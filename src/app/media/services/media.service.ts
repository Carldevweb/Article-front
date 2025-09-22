import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Media } from '../../core/models/media';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private collection$: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(
    []
  );

  private apiUrl = 'http://localhost:8080/medias';

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }
  refreshCollection() {
    this.http.get<Media[]>(`${this.apiUrl}`).pipe(
      map((media) => {
        return media.map((media) => new Media(media));
      })
    );
  }

  public get collection(): Observable<Media[]> {
    return this.collection$.asObservable();
  }

  createMedia(media: Media) {
    return this.http.post(`${this.apiUrl}`, media).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }
}
