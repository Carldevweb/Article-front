import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../core/models/article';
import { AuthService } from '../../../core/services/auth.service';

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

  @Input() liked = false;

  @Output() likeToggle = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  canEdit = false;
  canDelete = false;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.canEdit = this.authService.isAuthenticated() && this.authService.hasAnyRole(['EMPLOYEE', 'ADMIN']);
    this.canDelete = this.authService.isAuthenticated() && this.authService.hasAnyRole(['ADMIN']);
  }

  onLikeClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.likeToggle.emit();
  }

  onDeleteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const id = this.article?.id;
    if (id != null) {
      this.delete.emit(id);  // ✅ correct
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;

    img.src = 'assets/default-article.jpg';
  }
}
