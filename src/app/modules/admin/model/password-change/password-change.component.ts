import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { PasswordChangeService } from './password-change.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { IconInputComponent } from 'src/app/modules/custom/icon-input/icon-input.component';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    TranslateModule,
    IconInputComponent,
  ],
})
export class PasswordChangeComponent implements OnInit {
  changePassword!: FormGroup;
  customErrorMessages: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PasswordChangeComponent>,
    private _alert: AlertService,
    private _passwordChangeService: PasswordChangeService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.changePassword = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.customErrorMessages = {
      passwordMismatch: this.translate.instant('PASSWORDS_DO_NOT_MATCH'),
    };
  }

  passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword)
      form.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
    else form.get('confirmNewPassword')?.setErrors(null);
  }

  createChangePassword() {
    if (this.changePassword.invalid) {
      this.changePassword.markAllAsTouched();
    } else {
      this.translate.get('CONFIRM_CREATE_PASSWORD').subscribe((mes: string) => {
        this._alert.confirmPass(mes).subscribe((result: boolean) => {
          if (result) {
            const loadingRef = this.dialog.open(ApiLoadingComponent, {
              disableClose: true,
            });

            let data = cloneDeep(this.changePassword.value);
            delete data.confirmNewPassword;

            this._passwordChangeService.changePassword(data).subscribe({
              next: (response: any) => {
                if (response.errorCode === '000') {
                  loadingRef.close();
                  this._alert.notifyPass(response.message, 'SUCCESS');
                  this.dialogRef.close();
                } else {
                  loadingRef.close();
                  this._alert.notifyPass(
                    response.message || `Something went wrong.`,
                    'FAIL'
                  );
                }
              },
              error: (error: any) => {
                loadingRef.close();
                this._alert.notify(`Something went wrong.`, 'FAIL');
              },
            });
          }
        });
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
