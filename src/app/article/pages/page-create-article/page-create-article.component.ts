import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-page-create-article',
  standalone: false,
  templateUrl: './page-create-article.component.html',
  styleUrls: ['./page-create-article.component.scss'],
})
export class PageCreateArticleComponent {
  errorMsg: string | null = null;
  isSubmitting = false;

  // ✅ name = clé du form, en minuscule, alignée backend
  formFields = [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      placeholder: 'Entrer le titre',
    },
    {
      name: 'auteur',
      type: 'text',
      label: 'Auteur',
      placeholder: "Nom de l'auteur",
    },
    {
      name: 'contenu',
      type: 'textarea',
      label: 'Contenu',
      placeholder: "Contenu de l'article",
    },
  ];

  constructor(private articleService: ArticleService, private router: Router) {}

  onFormSubmit(formData: any) {
    this.errorMsg = null;

    // Sécurité minimale
    if (!formData?.titre || !formData?.auteur || !formData?.contenu) {
      this.errorMsg = 'Tous les champs sont obligatoires.';
      return;
    }

    this.isSubmitting = true;

    // ✅ payload aligné backend (titre/contenu/auteur)
    const payload = {
      titre: formData.titre,
      contenu: formData.contenu,
      auteur: formData.auteur,
    };

    this.articleService.createArticle(payload as any).subscribe({
      next: (created: any) => {
        // redirection vers détail
        this.router.navigate(['/articles', created.id]);
      },
      error: (err) => {
        if (err?.status === 401) this.errorMsg = 'Non authentifié. Connecte-toi.';
        else if (err?.status === 403) this.errorMsg = 'Accès refusé (rôle insuffisant).';
        else this.errorMsg = "Erreur lors de la création de l'article.";
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  onFieldRemoved(fieldName: string) {
    this.formFields = this.formFields.filter((field) => field.name !== fieldName);
  }
}
