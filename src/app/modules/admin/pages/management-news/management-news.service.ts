import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class ManagementNewsService {
  private readonly _searchNews = SERVICE_URLS.NEWS_SEARCH;
  private readonly _createNews = SERVICE_URLS.NEWS_CREATE;
  private readonly _detailNews = SERVICE_URLS.NEWS_DETAIL;
  private readonly _updateNews = SERVICE_URLS.NEWS_UPDATE;
  private readonly post_status = SERVICE_URLS.NEWS_STATUS;

  constructor(private _http: HttpClient) {}

  searchNews(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'en',
      'Request-Id': '123443343',
    });
    return this._http.get(`${this._searchNews}`, { headers, params });
  }

  createNews(data: any): Observable<any> {
    return this._http.post(`${this._createNews}`, data);
  }

  newsDetail(params: any) {
    const headers = new HttpHeaders({
      'Accept-Language': 'en',
      'Request-Id': '123443343',
    });
    return this._http.get(`${this._detailNews}`, { headers, params });
  }

  updateNews(data: any): Observable<any> {
    return this._http.post(`${this._updateNews}`, data);
  }

  changeStatus(data: any): Observable<any> {
    return this._http.post<any>(`${this.post_status}`, data);
  }
}
