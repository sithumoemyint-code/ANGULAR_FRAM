import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private readonly _statistic = SERVICE_URLS.STATISTIC;
  private readonly _branch = SERVICE_URLS.BRANCH;
  private readonly _township = SERVICE_URLS.TOWNSHIP;
  private readonly _fbbLeader = SERVICE_URLS.FBBLEADER;
  private readonly _b2b = SERVICE_URLS.D2D;
  private readonly _extraTable = SERVICE_URLS.EXTRA_TABLE;

  constructor(private http: HttpClient) {}

  geStatistic(params: any = {}): Observable<any> {
    return this.http.get(`${this._statistic}`, { params });
  }

  getBranch(params: any = {}): Observable<any> {
    return this.http.get(`${this._branch}`, { params });
  }

  getTownship(params: any = {}): Observable<any> {
    return this.http.get(`${this._township}`, { params });
  }

  getFBBLeader(params: any = {}): Observable<any> {
    return this.http.get(`${this._fbbLeader}`, { params });
  }

  getD2D(params: any = {}): Observable<any> {
    return this.http.get(`${this._b2b}`, { params });
  }
  extraTable(params: any = {}): Observable<any> {
    return this.http.get(`${this._extraTable}`, { params });
  }
}
