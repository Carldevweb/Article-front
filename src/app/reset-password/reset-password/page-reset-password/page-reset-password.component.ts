import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-page-reset-password',
  templateUrl: './page-reset-password.component.html',
  styleUrl: './page-reset-password.component.scss',
  standalone: false,
})
export class PageResetPasswordComponent {
  token: string | null;

  nouveauMotDePasse = '';
  confirmation = '';

  loading = false;
  message = '';
  erreur = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.erreur = 'Lien invalide : token manquant.';
    }
  }

  valider() {
    this.message = '';
    this.erreur = '';

    if (!this.token) {
      this.erreur = 'Token manquant.';
      return;
    }
    if (!this.nouveauMotDePasse || this.nouveauMotDePasse.length < 8) {
      this.erreur = 'Mot de passe invalide (8 caractères minimum).';
      return;
    }
    if (this.nouveauMotDePasse !== this.confirmation) {
      this.erreur = 'La confirmation ne correspond pas.';
      return;
    }

    this.loading = true;
    this.authService.reinitialiserMotDePasse(this.token, this.nouveauMotDePasse).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Mot de passe modifié. Redirection vers la connexion…';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        const backendMsg = err?.error?.message || err?.error || err?.message || '';
        const msg = String(backendMsg).toLowerCase();

        if (msg.includes('expir')) this.erreur = "Lien expiré. Refaire une demande 'mot de passe oublié'.";
        else if (msg.includes('utilis')) this.erreur = "Lien déjà utilisé. Refaire une demande 'mot de passe oublié'.";
        else if (msg.includes('inval')) this.erreur = "Lien invalide. Refaire une demande 'mot de passe oublié'.";
        else this.erreur = "Erreur lors de la réinitialisation.";
      }
    });
  }
}
