import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly _searchCustomer = SERVICE_URLS.CUSTOMER_SEARCH;
  private readonly _createCustomer = SERVICE_URLS.CUSTOMER_CREATE;
  private readonly _detail = SERVICE_URLS.CUSTOMER_DETAIL;
  private readonly _allAdminAccount = SERVICE_URLS.ALL_ADMIN_ACCOUNT;
  private readonly _export = SERVICE_URLS.EXPORT_USER;
  private readonly _changeStatus = SERVICE_URLS.USER_STATUS;
  private readonly _updateCustomer = SERVICE_URLS.UPDATE_CUSTOMER;

  constructor(private _http: HttpClient) {}

  searchCustomer(params: any) {
    return this._http.get(this._searchCustomer, { params });
  }

  createCustomer(body: any) {
    return this._http.post(this._createCustomer, body);
  }

  detailCustomer(id: any) {
    return this._http.get([this._detail, id].join('/'));
  }

  deleteCustomer(id: any) {
    return this._http.delete([this._detail, id].join('/'));
  }

  updateCustomer(id: any, customerData: any) {
    const url = `${this._updateCustomer}/${id}`;
    return this._http.put(url, customerData);
  }

  adminList() {
    return this._http.get(`${this._allAdminAccount}`);
  }

  exportUser(params: any) {
    return this._http.get(this._export, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params,
    });
  }

  updateCustomerStatus(customerId: number, status: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = `${this._changeStatus}/${customerId}/status`;

    return this._http.put(url, status, { headers });
  }
}
