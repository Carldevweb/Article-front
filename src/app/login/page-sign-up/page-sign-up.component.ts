import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { getBackendMessage } from '../../core/http/http-error.util';

@Component({
  selector: 'app-page-sign-up',
  standalone: false,
  templateUrl: './page-sign-up.component.html',
  styleUrls: ['./page-sign-up.component.scss'],
})
export class PageSignUpComponent implements OnInit {
  form!: FormGroup;

  loading = false;
  submitted = false;

  messageSucces = '';
  messageErreur = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomUtilisateur: ['', [Validators.required, Validators.minLength(2)]],
      prenomUtilisateur: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isInvalid(fieldName: string): boolean {
    const ctrl = this.form.get(fieldName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  submit(): void {
    this.messageSucces = '';
    this.messageErreur = '';
    this.submitted = true;

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.form.value;

    // ⚠️ Adapte si ton service s'appelle autrement
    this.authService.inscription(payload).subscribe({
      next: () => {
        this.loading = false;

        // ✅ redirection vers login avec message "created=1"
        this.router.navigate(['/login/sign-in'], { queryParams: { created: 1 } });
      },
      error: (err) => {
        this.loading = false;
        this.messageErreur = getBackendMessage(err, "Erreur lors de la création du compte.");
      },
    });
  }
}