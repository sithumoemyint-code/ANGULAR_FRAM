import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class CommonNotiService {
  private readonly GET = SERVICE_URLS.GET_MESSAGE_TEMPLATE;
  private readonly CHANGE_STATUS = SERVICE_URLS.TEMPLATE_STATUS;

  constructor(private _http: HttpClient) {}

  getTemplate(params: any) {
    return this._http.get(this.GET, { params });
  }

  changeStatus(statusData: any): Observable<any> {
    return this._http.put(this.CHANGE_STATUS, statusData);
  }

  updateTemplate(body: any) {
    return this._http.put(this.GET, body);
  }
}
