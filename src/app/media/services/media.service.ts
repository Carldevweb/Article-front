import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Media } from '../../core/models/media';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UploadResponse {
  filename: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private collection$ = new BehaviorSubject<Media[]>([]);
  private apiUrl = 'http://localhost:8080/medias';

  constructor(private http: HttpClient) {}

  private getAuthHeadersOnly(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private getJsonHeadersWithJwt(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  public get collection(): Observable<Media[]> {
    return this.collection$.asObservable();
  }

  refreshCollectionByArticle(articleId: number): void {
    this.http
      .get<Media[]>(`${this.apiUrl}/article/${articleId}`, {
        headers: this.getAuthHeadersOnly(),
      })
      .pipe(map((medias) => medias.map((m) => new Media(m))))
      .subscribe({
        next: (medias) => this.collection$.next(medias),
        error: () => this.collection$.next([]),
      });
  }

  getByArticle(articleId: number): Observable<Media[]> {
    return this.http
      .get<Media[]>(`${this.apiUrl}/article/${articleId}`, {
        headers: this.getAuthHeadersOnly(),
      })
      .pipe(map((medias) => medias.map((m) => new Media(m))));
  }

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData, {
      headers: this.getAuthHeadersOnly(),
    });
  }

  createMedia(media: any): Observable<Media> {
    return this.http.post<Media>(`${this.apiUrl}`, media, {
      headers: this.getJsonHeadersWithJwt(),
    });
  }

  // ✅ AJOUT : MAJ media
  updateMedia(id: number, media: any): Observable<Media> {
    return this.http.put<Media>(`${this.apiUrl}/${id}`, media, {
      headers: this.getJsonHeadersWithJwt(),
    });
  }

  // ✅ Optionnel : supprimer
  deleteMedia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeadersOnly(),
    });
  }

  createMediaAndRefresh(media: any & { articleId?: number }): Observable<Media> {
    return this.createMedia(media).pipe(
      tap(() => {
        const articleId = media?.articleId;
        if (typeof articleId === 'number') {
          this.refreshCollectionByArticle(articleId);
        }
      })
    );
  }
}
  