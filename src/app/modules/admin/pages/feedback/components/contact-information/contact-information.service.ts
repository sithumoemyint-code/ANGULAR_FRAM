import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class ContactInformationService {
  private readonly _contactList = SERVICE_URLS.CONTACT_LIST;
  private readonly _deleteContactList = SERVICE_URLS.CONTACT_LIST_DELETE;

  constructor(private http: HttpClient) {}

  contactList(params: any): Observable<any> {
    return this.http.get<any>(this._contactList, { params });
  }

  crateContact(data: any): Observable<any> {
    return this.http.post<any>(this._contactList, data);
  }

  deleteContact(contactId: string): Observable<any> {
    return this.http.delete<any>(`${this._deleteContactList}${contactId}`);
  }
}
