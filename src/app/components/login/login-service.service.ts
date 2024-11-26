import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  private readonly _login = SERVICE_URLS.LOGIN;
  private readonly _confirmLogin = SERVICE_URLS.CONFIRM_LOGIN;

  constructor(private http: HttpClient) {}

  login(params: any) {
    return this.http.post(this._login, params);
  }

  confirmLogin(params: any) {
    return this.http.post(this._confirmLogin, params);
  }
}
