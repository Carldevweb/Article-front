import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/models/user';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-page-profil',
  standalone: false,
  templateUrl: './page-profil.component.html',
  styleUrl: './page-profil.component.scss',
})
export class PageProfilComponent implements OnInit {
  private loginService = inject(LoginService);

  user: User | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginService.getProfil().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du profil';
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
