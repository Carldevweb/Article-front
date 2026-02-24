import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-container',
  standalone: false,
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss'],
})
export class CardContainerComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
}