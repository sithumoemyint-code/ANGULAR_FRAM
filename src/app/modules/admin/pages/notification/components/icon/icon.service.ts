import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly _getIcon = SERVICE_URLS.GET_NOTI_ICON;
  private readonly _getMessageType = SERVICE_URLS.ICON_MESSAGE_TYPE;
  private readonly _updateIcon = SERVICE_URLS.UPDATE_ICON;

  constructor(private _http: HttpClient) {}

  getIcon() {
    return this._http.get(this._getIcon);
  }

  getMessageType() {
    return this._http.get(this._getMessageType);
  }

  updateIcon(body: any) {
    return this._http.put(this._updateIcon, body);
  }
}
