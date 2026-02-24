import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getBackendMessage } from '../../core/http/http-error.util';

@Component({
  selector: 'app-page-sign-in',
  standalone: false,
  templateUrl: './page-sign-in.component.html',
  styleUrls: ['./page-sign-in.component.scss'],
})
export class PageSignInComponent implements OnInit {
  loading = false;
  authForm: FormGroup;

  messageSucces = '';
  messageErreur = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('created') === '1') {
      this.messageSucces = 'Compte créé avec succès. Tu peux te connecter.';
    }
  }

  isInvalid(fieldName: string): boolean {
    const ctrl = this.authForm.get(fieldName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  send(): void {
    this.messageSucces = '';
    this.messageErreur = '';
    this.submitted = true;

    if (this.authForm.invalid || this.loading) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, motDePasse } = this.authForm.value;
    this.loading = true;

    this.authService.connexion({ email, motDePasse }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/articles']);
      },
      error: (err) => {
        this.loading = false;
        this.messageErreur = getBackendMessage(
          err,
          "Erreur lors de l'authentification."
        );
      },
    });
  }
}