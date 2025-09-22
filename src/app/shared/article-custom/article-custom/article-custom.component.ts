import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article-custom',
  standalone: false,
  templateUrl: './article-custom.component.html',
  styleUrls: ['./article-custom.component.scss'],
})
export class ArticleCustomComponent {
  @Input() title!: string;
  @Input() content!: string;
  @Input() author?: string;
  @Input() date?: string;
  @Input() imageUrl?: string;
  @Input() showReadMore: boolean = false;
}
