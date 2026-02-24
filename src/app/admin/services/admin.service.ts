import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { Page } from '../../core/models/page';
import { AdminUserDto } from '../../core/dto/admin-user.dto';
import { Role } from '../../core/auth/role.type';

import { UpdateRoleRequest } from '../../core/dto/update-role.request';
import { CreateCategorieRequest } from '../../core/dto/create-categorie.request';


@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUsers(params: { page?: number; size?: number; q?: string }): Observable<Page<AdminUserDto>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) httpParams = httpParams.set('page', String(params.page));
    if (params.size !== undefined) httpParams = httpParams.set('size', String(params.size));
    if (params.q) httpParams = httpParams.set('q', params.q);

    return this.http.get<Page<AdminUserDto>>(`${this.baseUrl}/users`, { params: httpParams });
  }

  updateUserRole(userId: number, role: Role): Observable<AdminUserDto> {
    const body: UpdateRoleRequest = { role };
    return this.http.patch<AdminUserDto>(`${this.baseUrl}/users/${userId}/role`, body);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  createCategory(nomCategorie: string): Observable<any> {
    const body: CreateCategorieRequest = { nomCategorie };
    return this.http.post<any>(`${this.baseUrl}/categories`, body);
  }
}
