import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../core/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private users$ = new BehaviorSubject<User[]>([]);
  private apiUrl = 'http://localhost:8080/authentification';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Connexion de l'utilisateur, retourne un token JWT
   */
  signin(email: string, motDePasse: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${this.apiUrl}/connexion`,
        { email, motDePasse },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap(response => {
          // Stocker le nouveau token
          localStorage.setItem('token', response.token);
          // Mettre à jour le user courant dans le BehaviorSubject
          const user = new User({ email, token: response.token });
          localStorage.setItem('utilisateur', JSON.stringify(user));
          this.users$.next([user]);
        })
      );
  }

  /**
   * Renouvellement du token via l'endpoint backend
   */
  renewToken(): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé pour renouvellement');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<string>(
      `${this.apiUrl}/renouveler-token`,
      null,
      { headers, responseType: 'text' as 'json' }
    )
    .pipe(
      tap(newToken => {
        // Stocker le nouveau token
        localStorage.setItem('token', newToken);
        // Mettre à jour l'utilisateur
        const stored = localStorage.getItem('utilisateur');
        if (stored) {
          const user = JSON.parse(stored) as User;
          user.token = newToken;
          localStorage.setItem('utilisateur', JSON.stringify(user));
          this.users$.next([user]);
        }
      })
    );
  }

  getProfil(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profil`, { headers });
  }

  deconnexion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    this.users$.next([]);
    this.router.navigate(['/accueil']);
  }

  estAuthentifie(): boolean {
    const userJson = localStorage.getItem('utilisateur');
    if (!userJson) {
      return false;
    }
    const user = JSON.parse(userJson) as User;
    if (!user.token) {
      return false;
    }
    const exp = this.getTokenExpirationDate(user.token);
    if (exp && exp < new Date()) {
      this.deconnexion();
      return false;
    }
    return true;
  }

  private getTokenExpirationDate(token: string): Date | null {
    const payload = this.decodeJwt(token);
    if (!payload || !payload.exp) {
      return null;
    }
    // exp est en secondes
    return new Date(payload.exp * 1000);
  }

  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  get utilisateur$(): Observable<User[]> {
    return this.users$.asObservable();
  }

  getUtilisateur(): User | null {
    const stored = localStorage.getItem('utilisateur');
    return stored ? JSON.parse(stored) as User : null;
  }
}
