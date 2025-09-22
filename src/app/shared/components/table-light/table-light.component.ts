import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-light',
  standalone: false,
  templateUrl: './table-light.component.html',
  styleUrl: './table-light.component.scss',
})
export class TableLightComponent {
  @Input() headers: string[] = [];
}
