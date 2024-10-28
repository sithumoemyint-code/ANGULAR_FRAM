import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AdminstatorAccountComponent } from '../model/adminstator-account/adminstator-account.component';
import { MatIconModule } from '@angular/material/icon';
import { PaginationStandaloneComponent } from 'src/app/modules/custom/pagination-standalone/pagination-standalone.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { AddInformationDetailComponent } from '../model/add-information-detail/add-information-detail.component';
import { AdminAccountService } from './admin-account.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { cloneDeep } from 'lodash';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { LoadingComponent } from 'src/app/modules/custom/loading/loading.component';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface SelectStatusType {
  value: string;
  label: string;
}
interface AdminAccType {
  accountId: string;
  name: string;
  email: string;
  role: string;
  createBy: string;
  status: boolean;
}
@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.scss'],
  standalone: true,
  imports: [
    InputComponent,
    SelectComponent,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    PaginationStandaloneComponent,
    MatProgressSpinnerModule,
    PaginatorComponent,
    LoadingComponent,
    PermissionDirective,
    TranslateModule,
  ],
})
export class AdminAccountComponent {
  searchTable!: FormGroup;

  isChecked: boolean = false;

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;

  isLoading: boolean = false;

  public selectStatus: SelectStatusType[] = [];

  public adminAccData: AdminAccType[] = [];

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private _alert: AlertService,
    private _adminAccountService: AdminAccountService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.searchTable = this.fb.group({
      name: [''],
      email: ['', Validators.email],
      accountStatus: [''],
    });

    this.getAdminAccountDropdown();
  }

  create() {
    const dialogRef = this._dialog.open(AdminstatorAccountComponent, {
      width: '40%',
      disableClose: false,
    });

    dialogRef.componentInstance.adminAccountCreated.subscribe(
      (message: string) => {
        if (message === 'success') this.search();
      }
    );
  }

  getAdminAccountDropdown() {
    this._adminAccountService.getAdminAccountDropdown().subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this.selectStatus = response.result.map((res: any) => ({
            value: res,
            label: res,
          }));

          this.searchTable.patchValue({
            accountStatus: response.result[0],
          });

          this.search();
        } else {
          this.translate
            .get('COMMONE.ROLE_DROPDOWN')
            .subscribe((successMessage: string) => {
              this._alert.notify(response.message || successMessage, 'FAIL');
            });
        }
      },
      error: (error: any) => {
        this.translate
          .get('COMMONE.ROLE_DROPDOWN')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'FAIL');
          });
      },
    });
  }

  search(offset: number = 0) {
    if (!this.searchTable.invalid) {
      let params = cloneDeep(this.searchTable.value);

      params.page = this.offset = offset;
      params.size = this.size;

      this.adminAccData = [];
      this.isLoading = true;
      this._adminAccountService.accountSearch(params).subscribe({
        next: (response: any) => {
          if (response.errorCode === '000') {
            this.isLoading = false;

            this.adminAccData = response.result.content.map((res: any) => ({
              accountId: res.accountId,
              name: res.fullName,
              email: res.email,
              role: res.role,
              createBy: res.createdBy,
              status:
                res.status === 'ACTIVE'
                  ? true
                  : res.status === 'INACTIVE'
                  ? false
                  : true,
            }));
            this.totalOffset = response.result.totalPages - 1;
          } else {
            this.isLoading = false;
            this.translate
              .get('COMMONE.SOMETHING_WRONG')
              .subscribe((successMessage: string) => {
                this._alert.notify(response.message || successMessage, 'FAIL');
              });
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.translate
            .get('COMMONE.SOMETHING_WRONG')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'FAIL');
            });
        },
      });
    }
  }

  reset() {
    this.searchTable.reset({
      name: '',
      email: '',
      accountStatus: 'ALL', // Reset with the current date
    });

    this.search();
  }

  onToggle(accountId: string, item: any) {
    this.translate
      .get('CONFIRM_SWITCH_COMMOM.CONFIRM')
      .subscribe((successMessage: string) => {
        this._alert.confirm(successMessage).subscribe((result: boolean) => {
          if (result) {
            this._adminAccountService.adminAccountStatus(accountId).subscribe({
              next: (response: any) => {
                if (response.errorCode === '000') {
                  this.translate
                    .get('COMMONE.STATUS_SUCCESSFULLY')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(successMessage, 'SUCCESS');
                    });
                  item.status = !item.status;
                } else {
                  this.translate
                    .get('COMMONE.STATUS_CHANGES')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(
                        response.message || successMessage,
                        'FAIL'
                      );
                    });
                }
              },
              error: (error: any) => {
                this.translate
                  .get('COMMONE.STATUS_CHANGES')
                  .subscribe((successMessage: string) => {
                    this._alert.notify(successMessage, 'FAIL');
                  });
              },
            });
          }
        });
      });
  }

  delete(accountId: string) {
    this.translate
      .get('CONFIRMATION_ACCDELTE.DELETE')
      .subscribe((successMessage: string) => {
        this._alert.confirm(successMessage).subscribe((result: boolean) => {
          if (result) {
            const loadingRef = this.dialog.open(ApiLoadingComponent, {
              disableClose: true,
            });
            this._adminAccountService.accountDelete(accountId).subscribe({
              next: (response: any) => {
                if (response.errorCode === '000') {
                  loadingRef.close();
                  this.translate
                    .get('COMMONE.DELETE_ACCOUNT')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(successMessage, 'SUCCESS');
                    });
                  this.search(this.offset);
                } else if (response.errorCode === '239') {
                  loadingRef.close();
                  this._alert.notify(response.message, 'FAIL');
                } else {
                  loadingRef.close();
                  this.translate
                    .get('COMMONE.SOMETHING_WRONG')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(
                        response.message || successMessage,
                        'FAIL'
                      );
                    });
                }
              },
              error: (error: any) => {
                loadingRef.close();
                this.translate
                  .get('COMMONE.SOMETHING_WRONG')
                  .subscribe((successMessage: string) => {
                    this._alert.notify(successMessage, 'FAIL');
                  });
              },
            });
          }
        });
      });
  }

  edit(item: any) {
    this._dialog.open(AdminstatorAccountComponent, {
      width: '40%',
      disableClose: false,
      data: { refill: item },
    });
  }

  info(item: any) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    this._adminAccountService.getDetailAdminAccount(item.accountId).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this._dialog.open(AddInformationDetailComponent, {
            width: '40%',
            disableClose: false,
            data: response.result,
          });
          loadingRef.close();
        } else {
          loadingRef.close();
          this.translate
            .get('COMMONE.SOMETHING_WRONG')
            .subscribe((successMessage: string) => {
              this._alert.notify(response.message || successMessage, 'FAIL');
            });
        }
      },
      error: (error: any) => {
        loadingRef.close();
        this.translate
          .get('COMMONE.SOMETHING_WRONG')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'FAIL');
          });
      },
    });
  }

  changeFrontNumber(createBy: string) {
    if (isNaN(Number(createBy))) return createBy;

    let result = createBy;

    if (createBy.startsWith('84')) result = '0' + createBy.substring(2);

    return result;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search();
    }
  }
}
