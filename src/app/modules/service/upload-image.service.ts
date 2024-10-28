import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private readonly _uploadImage = SERVICE_URLS.UPLOAD_IMAGE;
  constructor(private _http: HttpClient) {}

  uploadImage(formData: FormData) {
    return this._http.post(this._uploadImage, formData);
  }
}
