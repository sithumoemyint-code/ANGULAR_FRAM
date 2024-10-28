import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  private readonly _login = SERVICE_URLS.LOGIN;

  constructor(private http: HttpClient) {}

  loginUser(data: any): Observable<any> {
    return this.http.post<any>(`${this._login}`, data);
  }
}
