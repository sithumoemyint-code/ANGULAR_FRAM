import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class AdminAccountService {
  private readonly _account_search = SERVICE_URLS.ACCOUNT_SEARCH;
  private readonly _account_create = SERVICE_URLS.ACCOUNT_CREATE;
  private readonly _account_delete = SERVICE_URLS.ACCOUNT_DELETE;
  private readonly _get_admin_account_dropdown =
    SERVICE_URLS.GET_ADMIN_ACCOUNT_DROPDOWN;
  private readonly _admin_account_status = SERVICE_URLS.ADMIN_ACCOUNT_STATUS;
  private readonly _admin_acc_detail = SERVICE_URLS.ADMIN_ACC_DETAIL;

  constructor(private http: HttpClient) {}

  getAdminAccountDropdown(): Observable<any> {
    return this.http.get<any>(this._get_admin_account_dropdown);
  }

  adminAccountStatus(customerId: string): Observable<any> {
    return this.http.put<any>(
      `${this._admin_account_status}${customerId}/status`,
      null
    );
  }

  accountSearch(params: any): Observable<any> {
    return this.http.get<any>(this._account_search, { params });
  }

  accountCreate(data: any): Observable<any> {
    return this.http.post<any>(this._account_create, data);
  }

  accountDelete(accountId: string): Observable<any> {
    return this.http.delete<any>(`${this._account_delete}${accountId}`);
  }

  getDetailAdminAccount(accountId: string): Observable<any> {
    return this.http.get<any>(`${this._admin_acc_detail}${accountId}`);
  }
}
