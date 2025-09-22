import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-create-article',
  standalone: false,
  templateUrl: './page-create-article.component.html',
  styleUrls: ['./page-create-article.component.scss'],
})
export class PageCreateArticleComponent implements OnInit {
  ngOnInit(): void {
    console.log('Form fields', this.formFields);
  }
  formFields = [
    {
      name: 'Titre',
      type: 'text',
      label: 'Titre',
      placeholder: 'Entrer le titre',
    },
    {
      name: 'Auteur',
      type: 'text',
      label: 'Auteur',
      placeholder: "Nom de l'auteur",
    },
    {
      name: 'Contenu',
      type: 'textarea',
      label: 'Contenu',
      placeholder: "Contenu de l'article",
    },
  ];

  onFormSubmit(formData: any) {
    console.log('Form Submitted:', formData);
  }

  onFieldRemoved(fieldName: string) {
    this.formFields = this.formFields.filter(
      (field) => field.name !== fieldName
    );
    console.log(`Field "${fieldName}" removed`);
  }

  removeField(fieldName: string) {
    this.formFields = this.formFields.filter(
      (field) => field.name !== fieldName
    );
  }
}
