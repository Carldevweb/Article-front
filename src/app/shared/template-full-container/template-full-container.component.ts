import { Component } from '@angular/core';

@Component({
  selector: 'app-template-full-container',
  standalone: false,
  templateUrl: './template-full-container.component.html',
  styleUrl: './template-full-container.component.scss',
})
export class TemplateFullContainerComponent {
  public title: string;
  constructor() {
    this.title = 'Ohhhhh le joli title';
  }
  ngOnInit(): void {}
}
