import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

import { User } from '../models/user';

import { ConnexionRequete } from '../dto/connexion-requete.dto';
import { ConnexionReponse } from '../dto/connexion-reponse.dto';
import { TokenResponse } from '../dto/token-response.dto';
import { ApiMessageResponse } from '../dto/api-message-response.dto';
import { InscriptionRequete } from '../dto/inscription-requete.dto';
import { InscriptionReponse } from '../dto/inscription-reponse.dto';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiBaseUrl}/authentification`;

  private readonly tokenKey = 'access_token';
  private readonly userKey = 'utilisateur';
  private readonly roleKey = 'role';

  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  inscription(dto: InscriptionRequete): Observable<InscriptionReponse> {
    return this.http.post<InscriptionReponse>(`${this.base}/inscription`, dto);
  }

  connexion(dto: ConnexionRequete): Observable<User> {
    return this.http.post<ConnexionReponse>(`${this.base}/connexion`, dto).pipe(
      tap(({ token }) => this.setToken(token)),
      switchMap(() => this.profil()),
      tap((user) => this.setUser(user))
    );
  }

  profil(): Observable<User> {
    return this.http.get<User>(`${this.base}/profil`);
  }

  renewToken(): Observable<TokenResponse> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('Aucun token trouvé'));

    return this.http.post<TokenResponse>(`${this.base}/renouveler-token`, null).pipe(
      tap((res) => this.setToken(res.token))
    );
  }

  hydrateUser(user: User): void {
    this.setUser(user);
  }

  getToken(): string | null {
    const raw = localStorage.getItem(this.tokenKey);
    if (!raw) return null;
    return raw.startsWith('Bearer ') ? raw.substring(7).trim() : raw.trim();
  }

  setToken(token: string): void {
    const cleaned = token?.startsWith('Bearer ') ? token.substring(7).trim() : token?.trim();
    if (!cleaned) {
      localStorage.removeItem(this.tokenKey);
      return;
    }
    localStorage.setItem(this.tokenKey, cleaned);
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));

    let role = String((user as any)?.role ?? '').toUpperCase().trim();
    if (role.startsWith('ROLE_')) role = role.substring(5);

    if (role) localStorage.setItem(this.roleKey, role);
    this.userSubject.next(user);
  }

  getRole(): 'USER' | 'EMPLOYEE' | 'ADMIN' | null {
    let r = (localStorage.getItem(this.roleKey) ?? '').toUpperCase().trim();
    if (r.startsWith('ROLE_')) r = r.substring(5);

    if (r === 'USER' || r === 'EMPLOYEE' || r === 'ADMIN') return r;
    return null;
  }

  hasAnyRole(roles: Array<'USER' | 'EMPLOYEE' | 'ADMIN'>): boolean {
    const role = this.getRole();
    return !!role && roles.includes(role);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isEmployeeOrAdmin(): boolean {
    return this.hasAnyRole(['EMPLOYEE', 'ADMIN']);
  }

  motDePasseOublie(email: string): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.base}/mot-de-passe-oublie`, { email });
  }

  reinitialiserMotDePasse(token: string, nouveauMotDePasse: string): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.base}/reinitialiser-mot-de-passe`, {
      token,
      nouveauMotDePasse,
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    this.userSubject.next(null);
  }
}
