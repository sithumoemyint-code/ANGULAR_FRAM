import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private readonly _searchPackageUrl = SERVICE_URLS.SEARCH_PACKAGE;
  private readonly _changePackageStatusUrl = SERVICE_URLS.PACKAGE_CHANGE_STATUS;
  private readonly _getDetailPackageUrl = SERVICE_URLS.GET_DETAIL_PACKAGE;
  private readonly _createPackageUrl = SERVICE_URLS.CREATE_PACKAGE;
  private readonly _updatePackageUrl = SERVICE_URLS.UPDATE_PACKAGE;
  constructor(private _http: HttpClient) {}

  searchPackages(params: any) {
    return this._http.get(this._searchPackageUrl, { params });
  }

  changePackageStatus(body: any) {
    return this._http.post(this._changePackageStatusUrl, body);
  }

  getDetailPackage(params: any) {
    return this._http.get(this._getDetailPackageUrl, { params });
  }

  createPackage(body: any) {
    return this._http.post(this._createPackageUrl, body);
  }
  updatePackage(body: any) {
    return this._http.post(this._updatePackageUrl, body);
  }
}
