import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-sign-in',
  standalone: false,
  templateUrl: './page-sign-in.component.html',
  styleUrl: './page-sign-in.component.scss',
})
export class PageSignInComponent {
  authForm: FormGroup;
  messageErreur = '';

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  send() {
    if (this.authForm.valid) {
      const { email, motDePasse } = this.authForm.value;
      this.authService.signin(email, motDePasse).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.messageErreur = "Érreur de l'authentification";
          console.log("Erreur lors de l'authentification", err);
        },
      });
    }
  }
}
