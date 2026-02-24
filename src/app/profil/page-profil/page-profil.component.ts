import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { User } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-profil',
  standalone: false,
  templateUrl: './page-profil.component.html',
  styleUrls: ['./page-profil.component.scss'],
})
export class PageProfilComponent implements OnInit {
  loading = true;
  errorMsg: string | null = null;
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.errorMsg = null;

    this.authService
      .profil()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (u) => {
          this.user = u;

          // si ton AuthService expose bien cette méthode
          if (typeof (this.authService as any).hydrateUser === 'function') {
            (this.authService as any).hydrateUser(u);
          }
        },
        error: (err) => {
          if (err?.status === 401) this.errorMsg = 'Session expirée. Reconnecte-toi.';
          else this.errorMsg = 'Impossible de charger le profil.';
        },
      });
  }

  // Optionnel : seulement si tu as logout() dans AuthService
  logout(): void {
    if (typeof (this.authService as any).logout === 'function') {
      (this.authService as any).logout();
    }
  }
}