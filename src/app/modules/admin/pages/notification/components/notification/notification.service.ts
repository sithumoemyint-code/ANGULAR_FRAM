import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly NOTI = SERVICE_URLS.CAMPAIGN;
  private readonly NOTI_STATUS = SERVICE_URLS.NOTI_STATUS;
  private readonly _getIcon = SERVICE_URLS.GET_NOTI_ICON;
  private readonly excelExport = SERVICE_URLS.NOTI_EXCEL;
  private readonly formatExcel = SERVICE_URLS.EXCEL;
  private readonly getRouteType = SERVICE_URLS.GET_ROUTETYPE;

  constructor(private _http: HttpClient) {}

  getCampaign(params: any) {
    return this._http.get(this.NOTI, { params });
  }

  getRoute() {
    return this._http.get(this.getRouteType);
  }

  createCampaign(body: any) {
    return this._http.post(this.NOTI, body);
  }

  updateCampaign(body: any) {
    return this._http.put(this.NOTI, body);
  }

  deleteCampaign(id: any) {
    return this._http.delete([this.NOTI, id].join('/'));
  }

  detailCampaign(id: any) {
    return this._http.get([this.NOTI, id].join('/'));
  }

  getStatus() {
    return this._http.get(this.NOTI_STATUS);
  }

  getIcon() {
    return this._http.get(this._getIcon);
  }

  getIconForNoti(params: any) {
    return this._http.get(this._getIcon, { params });
  }

  exportExcel(id: any): Observable<Blob> {
    const url = [this.excelExport, id].join('/');

    return this._http.get(url, { responseType: 'blob' }).pipe(
      map((response: Blob) => {
        return response;
      })
    );
  }

  formatExcelFile(): Observable<Blob> {
    return this._http.get(this.formatExcel, { responseType: 'blob' }).pipe(
      map((response: Blob) => {
        return response;
      })
    );
  }
}
