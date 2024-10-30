import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private readonly _statistic = SERVICE_URLS.STATISTIC;

  constructor(private http: HttpClient) {}

  getStatistic(): Observable<any> {
    return this.http.get(`${this._statistic}`);
  }
}
