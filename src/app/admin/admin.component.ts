import { Component, OnInit } from '@angular/core';

import { AdminService } from './services/admin.service';
import { AdminUserDto } from '../core/dto/admin-user.dto';
import { Page } from '../core/models/page';
import { Role } from '../core/auth/role.type';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  usersPage?: Page<AdminUserDto>;
  loading = false;
  error: string | null = null;

  page = 0;
  size = 10;

  roles: Role[] = ['USER', 'EMPLOYEE', 'ADMIN'];

  newCategoryName = '';
  categoryMessage: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getUsers({ page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.usersPage = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur chargement utilisateurs';
        this.loading = false;
      },
    });
  }

  changeRole(user: AdminUserDto, newRole: Role): void {
    const oldRole = user.role;

    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: (updated) => {
        user.role = updated.role;
      },
      error: (err) => {
        user.role = oldRole;
        alert(err?.error?.message || 'Erreur changement rôle');
      },
    });
  }

  deleteUser(user: AdminUserDto): void {
    if (!confirm(`Supprimer ${user.email} ?`)) return;

    this.adminService.deleteUser(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert(err?.error?.message || 'Erreur suppression'),
    });
  }

  createCategory(): void {
    const name = this.newCategoryName.trim();
    if (name.length < 2) {
      alert('Nom trop court');
      return;
    }

    this.adminService.createCategory(name).subscribe({
      next: () => {
        this.categoryMessage = 'Catégorie créée';
        this.newCategoryName = '';
      },
      error: (err) => {
        this.categoryMessage = err?.error?.message || 'Erreur création catégorie';
      },
    });
  }

  nextPage(): void {
    if (!this.usersPage) return;
    if (this.page >= this.usersPage.totalPages - 1) return;
    this.page++;
    this.loadUsers();
  }

  prevPage(): void {
    if (this.page <= 0) return;
    this.page--;
    this.loadUsers();
  }
}
