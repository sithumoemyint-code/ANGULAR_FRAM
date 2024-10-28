import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly _listPermission = SERVICE_URLS.LIST_PERMISSION;
  private readonly _listRole = SERVICE_URLS.LIST_ROLE;
  private readonly _createRole = SERVICE_URLS.CREATE_ROLE;
  private readonly _deleteRole = SERVICE_URLS.DELETE_ROLE;
  private readonly _detailRole = SERVICE_URLS.ROLE_DETAIL;
  private readonly _editRole = SERVICE_URLS.ROLE_EDIT;

  constructor(private http: HttpClient) {}

  listRole(): Observable<any> {
    return this.http.get<any>(this._listRole);
  }

  listPermission(): Observable<any> {
    return this.http.get<any>(this._listPermission);
  }

  createRole(data: any): Observable<any> {
    return this.http.post<any>(this._createRole, data);
  }

  detailRole(roleId: string): Observable<any> {
    return this.http.get<any>(`${this._detailRole}${roleId}`);
  }

  editRole(roleId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this._editRole}${roleId}`, data);
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http.delete<any>(`${this._deleteRole}${roleId}`);
  }
}
