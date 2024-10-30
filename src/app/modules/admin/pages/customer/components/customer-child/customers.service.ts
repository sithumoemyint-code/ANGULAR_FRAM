import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly _getAllCustomerUrl = SERVICE_URLS.GET_CUSTOMERS;
  constructor(private _http: HttpClient) {}

  getCustomers() {
    return this._http.get(this._getAllCustomerUrl);
  }
}
