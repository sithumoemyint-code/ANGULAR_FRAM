import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SuccessAndFailDialogComponent } from '../custom/model/success-and-fail-dialog/success-and-fail-dialog.component';
import { ConfirmComponent } from '../custom/model/confirm/confirm.component';
import { ConfirmPasswordComponent } from '../custom/model/confirm-password/confirm-password.component';
import { PasswordDialogComponent } from '../custom/model/password-dialog/password-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  confirm(description: string): Observable<boolean> {
    const _modal = this.dialog.open(ConfirmComponent, {
      width: '35%',
      // position: { top: '230px', left: '600px', right: '3px' },
      disableClose: false,
      data: { des: description },
    });

    return _modal.componentInstance._create.asObservable();
  }

  confirmPass(description: string): Observable<boolean> {
    const _modal = this.dialog.open(ConfirmPasswordComponent, {
      width: '35%',
      // position: { top: '230px', left: '600px', right: '3px' },
      disableClose: false,
      data: { des: description },
    });

    return _modal.componentInstance._create.asObservable();
  }

  notifyPass(des: string, type: string) {
    this.dialog.open(PasswordDialogComponent, {
      width: '35%',
      // position: { top: '230px', left: '600px', right: '3px' },
      disableClose: false,
      data: {
        des: des,
        type: type,
      },
    });
  }

  notify(des: string, type: string) {
    this.dialog.open(SuccessAndFailDialogComponent, {
      width: '35%',
      // position: { top: '230px', left: '600px', right: '3px' },
      disableClose: false,
      data: {
        des: des,
        type: type,
      },
    });
  }
}