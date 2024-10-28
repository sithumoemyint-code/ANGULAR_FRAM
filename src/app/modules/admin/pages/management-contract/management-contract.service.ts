import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class ManagementContractService {
  private readonly _searchListContract = SERVICE_URLS.LIST_CONTRACT_SEARCH;
  private readonly _contractDetail = SERVICE_URLS.LIST_CONTRACT_DETAIL;
  private readonly _contractEdit = SERVICE_URLS.LIST_CONTRACT_EDIT;
  private readonly _contractChangeStatus =
    SERVICE_URLS.LIST_CONTRACT_STATUS_CHANGE;
  private readonly _allAdminAccount = SERVICE_URLS.ALL_ADMIN_ACCOUNT;

  private readonly _listSearch = SERVICE_URLS.SEARCH_LIST;
  private readonly _listChangeStatus = SERVICE_URLS.CHANGE_STATUS_LIST;
  private readonly _listCreate = SERVICE_URLS.CONTRACT_CREATE;
  private readonly _detailContract = SERVICE_URLS.DETAIL_CONTRACT;
  private readonly _updateContract = SERVICE_URLS.UPDATE_CONTRACT;

  private readonly _allPackage = SERVICE_URLS.ALL_PACKAGE;
  private readonly _allCustomer = SERVICE_URLS.ALL_CUSTOMER;

  private readonly _export = SERVICE_URLS.EXPORT_CONTRACT;
  private readonly _showInterest = SERVICE_URLS.SHOW_INTEREST;

  constructor(private http: HttpClient) {}

  searchList(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'en',
      'Request-Id': '123',
    });
    return this.http.get(`${this._searchListContract}`, { headers, params });
  }

  contractDetail(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'vi',
      'Request-Id': '123',
    });
    return this.http.get(`${this._contractDetail}`, { headers, params });
  }

  editContract(data: any): Observable<any> {
    return this.http.post(`${this._contractEdit}`, data);
  }

  changeStatus(data: any): Observable<any> {
    return this.http.post<any>(`${this._contractChangeStatus}`, data);
  }

  getAllAdminAcc(): Observable<any> {
    return this.http.get(`${this._allAdminAccount}`);
  }

  // Contract List APIs

  list(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'vi',
      'Request-Id': '123e4567-e89b-12d3-a456-426655440000',
    });
    return this.http.get(`${this._listSearch}`, { headers, params });
  }

  listChangeStatus(data: any): Observable<any> {
    return this.http.post<any>(`${this._listChangeStatus}`, data);
  }

  createContract(data: any): Observable<any> {
    return this.http.post<any>(`${this._listCreate}`, data);
  }

  detailContract(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'vi',
      'Request-Id': '123e4567-e89b-12d3-a456-426655440000',
    });
    return this.http.get(`${this._detailContract}`, { headers, params });
  }

  allPackages(): Observable<any> {
    return this.http.get(`${this._allPackage}`);
  }

  updateContract(data: any): Observable<any> {
    return this.http.post<any>(`${this._updateContract}`, data);
  }

  //export api

  export(params: any): Observable<any> {
    return this.http.get<any>(this._export, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params: params,
    });
  }

  allCustomer(): Observable<any> {
    return this.http.get(`${this._allCustomer}`);
  }

  getInterest(data: any): Observable<any> {
    return this.http.post(`${this._showInterest}`, data);
  }
}
