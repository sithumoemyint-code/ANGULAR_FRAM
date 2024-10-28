import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { SERVICE_URLS } from 'src/assets/app.config'

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {
  private readonly _changePassword = SERVICE_URLS.CHANGE_PASSWORD

  constructor(
    private http: HttpClient
  ) { }

  changePassword(data: string): Observable<any> {
    return this.http.post<any>(this._changePassword, data)
  }
}
