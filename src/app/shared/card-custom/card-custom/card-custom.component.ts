import { Component, Input } from '@angular/core';
import { Article } from '../../../core/models/article';

@Component({
  selector: 'app-card-custom',
  templateUrl: './card-custom.component.html',
  styleUrls: ['./card-custom.component.scss'],
  standalone: false,
})
export class CardCustomComponent {

  @Input() article: Article | null = null;

  @Input() title?: string;
  @Input() content?: string;

  @Input() imageUrl?: string;
  @Input() footer?: string;

  @Input() routerLink?: any[] | string;
  @Input() queryParams?: any;
}
