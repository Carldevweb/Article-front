import { Component, Input } from '@angular/core';
import { Article } from '../../../core/models/article';

@Component({
  selector: 'app-card-custom',
  standalone: false,
  templateUrl: './card-custom.component.html',
  styleUrl: './card-custom.component.scss',
})
export class CardCustomComponent {
  @Input() article: Article | null = null;

  @Input() id!: number;
  @Input() title: string = 'Card Title';
  @Input() content: string = 'This is the card content.';
  @Input() imageUrl?: string;
  @Input() footer?: string;
}
