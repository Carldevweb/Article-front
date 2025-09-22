import { Component } from '@angular/core';

@Component({
  selector: 'app-template-full-width',
  standalone: false,
  templateUrl: './template-full-width.component.html',
  styleUrl: './template-full-width.component.scss'
})
export class TemplateFullWidthComponent {
  public title: string;
  constructor() {
  this.title = 'Liste des articles'
  }
  ngOnInit(): void {
  }
}



