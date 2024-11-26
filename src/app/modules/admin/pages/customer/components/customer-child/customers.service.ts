import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  id: any;

  private readonly _getAllCustomerUrl = SERVICE_URLS.GET_CUSTOMERS_EXTRA;
  // private readonly _getAllCustomerExtraUrl = SERVICE_URLS.GET_CUSTOMERS_EXTRA;

  private readonly _getCustomerDetailUrl = SERVICE_URLS.GET_CUSTOMER_DETAIL;
  private readonly _getCustomerStatusUrl = SERVICE_URLS.GET_CUSTOMER_STATUS;
  private readonly _download = SERVICE_URLS.DOWNLOAD;
  private readonly _editRecieved = SERVICE_URLS.RECIEVED;

  constructor(private _http: HttpClient) {}

  getCustomers(params: any) {
    return this._http.get(this._getAllCustomerUrl, { params });
  }
  // getCustomersExtra(params: any) {
  //   return this._http.get(this._getAllCustomerExtraUrl, { params });
  // }
  setId(id: any) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getCustomerDetail(id: any) {
    return this._http.get([this._getCustomerDetailUrl, id].join('/'));
  }

  getCustomerStatus(params: any) {
    return this._http.get(this._getCustomerStatusUrl, { params });
  }

  editStatus(body: any, id: any) {
    return this._http.post([this._getCustomerStatusUrl, id].join('/'), body);
  }

  download(): Observable<any> {
    return this._http.get<any>(this._download, {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }
  editRecievedStatus(id: any, body: any) {
    return this._http.post(
      [this._editRecieved, id, '/bcmReceived'].join('/'),
      body
    );
  }
  // download() {
  //   return this._http.get(this._download);
  // }
}
