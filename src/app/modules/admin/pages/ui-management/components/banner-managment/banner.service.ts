import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private readonly _searchBannerUrl = SERVICE_URLS.SEARCH_BANNER;
  private readonly _createBannerUrl = SERVICE_URLS.CREATE_BANNER;
  private readonly _updateBannerUrl = SERVICE_URLS.UPDATE_BANNER;
  private readonly _changeStatusBannerUrl = SERVICE_URLS.BANNER_CHANGE_STATUS;
  private readonly _deepLink = SERVICE_URLS.DEEP_LINK;
  constructor(private _http: HttpClient) {}

  searchBanner(params: any) {
    return this._http.get(this._searchBannerUrl, { params });
  }

  createBanner(body: any) {
    return this._http.post(this._createBannerUrl, body);
  }

  updateBanner(body: any) {
    return this._http.post(this._updateBannerUrl, body);
  }

  changeBannerStatus(body: any) {
    return this._http.post(this._changeStatusBannerUrl, body);
  }

  deepLink() {
    return this._http.get(this._deepLink);
  }
}
