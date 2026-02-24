import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-forgot-password',
  standalone: false,
  templateUrl: './page-forgot-password.component.html',
  styleUrl: './page-forgot-password.component.scss',
})
export class PageForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';
  erreur = '';

  constructor(private authService: AuthService) {}

  envoyerLien() {
    this.message = '';
    this.erreur = '';

    if (!this.email || !this.email.includes('@')) {
      this.erreur = 'Email invalide.';
      return;
    }

    this.loading = true;

    this.authService.motDePasseOublie(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res?.message || "Si l'email existe, un message a été envoyé.";
      },
      error: () => {
        this.loading = false;
        this.message = "Si l'email existe, un message a été envoyé.";
      },
    });
  }
}
