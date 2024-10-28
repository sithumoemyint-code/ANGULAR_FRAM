import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly history = SERVICE_URLS.HISTORY_NOTI;

  constructor(private http: HttpClient) {}

  getHistory(params: any) {
    return this.http.get(this.history, { params });
  }
}
