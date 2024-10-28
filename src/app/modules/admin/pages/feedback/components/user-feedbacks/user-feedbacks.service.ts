import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class UserFeedbacksService {
  private readonly _feedbackSearchList = SERVICE_URLS.FEEDBACK_SEARCH_LIST;
  private readonly _feedbackNote = SERVICE_URLS.FEEDBACK_NOTE;
  private readonly _feedbackStatus = SERVICE_URLS.FEEDBACK_STATUS;
  private readonly _feedbackDownStatus = SERVICE_URLS.FEEDBACK_DOWNLOAD;

  constructor(private http: HttpClient) {}

  userFeedbackList(params: any): Observable<any> {
    return this.http.get<any>(this._feedbackSearchList, { params });
  }

  feedbackNote(id: string, data: string): Observable<any> {
    return this.http.put<any>(`${this._feedbackNote}${id}`, data);
  }

  feedbackStatus(): Observable<any> {
    return this.http.get<any>(this._feedbackStatus);
  }

  feedbackDownload(params: any): Observable<any> {
    return this.http.get<any>(this._feedbackDownStatus, {
      responseType: 'blob' as 'json',
      observe: 'response',
      params,
    });
  }
}
