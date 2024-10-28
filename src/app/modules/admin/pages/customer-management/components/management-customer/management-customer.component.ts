import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { CustomerAccountComponent } from '../customer-account/customer-account.component';
import { MatMenuModule } from '@angular/material/menu';
import { UpdateAccountComponent } from '../update-account/update-account.component';
import { CreateContractComponent } from '../create-contract/create-contract.component';
import { CustomerService } from '../../customer.service';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionDirective } from '../../../permission.directive';

@Component({
  selector: 'app-management-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    MatIconModule,
    MatButtonModule,
    CustomerAccountComponent,
    MatMenuModule,
    MatProgressSpinnerModule,
    PaginatorComponent,
    TranslateModule,
    PermissionDirective,
  ],
  templateUrl: './management-customer.component.html',
  styleUrls: ['./management-customer.component.scss'],
})
export class ManagementCustomerComponent implements OnInit {
  _dialogRef!: MatDialogRef<any>;

  searchData: any[] = [];
  createdBy: any;
  _status: any;
  _id: any;
  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  searchForm!: FormGroup;
  selectStatus = [
    { value: 'ALL', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];
  isChecked: boolean = false;
  dropDownOpen: boolean = false;
  dropdownPosition = { top: '0px', left: '0px' };
  avatar: any;

  constructor(
    private _fb: FormBuilder,
    private _alert: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private _customer: CustomerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // const today = new Date();
    // const oneMonthAgo = new Date();
    // oneMonthAgo.setMonth(today.getMonth() - 1);

    this.searchForm = this._fb.group({
      input: [''],
      content: [''],
      accountStatus: ['ALL'],
      fromDate: [''],
      toDate: [''],
    });

    this.search();
  }

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  resetSearchForm() {
    this.searchForm.reset({
      input: '',
      content: '',
      accountStatus: 'ALL',
      fromDate: '',
      toDate: '',
    });
    this.search();
  }

  onChangeStatus(element: any) {
    this._status = element.status;
    this._id = element.customerId;

    if ((this, this._status === 'ACTIVE')) {
      this.translate
        .get('CONFIRMATION_ACCSTATUS.STATUS_LOCK')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this._confirmChangeStatus();
              }
            });
        });
    } else {
      this.translate
        .get('CONFIRMATION_ACCSTATUS.STATUS_ACTIVE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this._confirmChangeStatus();
              }
            });
        });
    }
  }

  _confirmChangeStatus() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._status = this._status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    let customerId = this._id;
    let status = this._status;

    this._customer
      .updateCustomerStatus(customerId, status)
      .subscribe((data: any) => {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_ACCSTATUS.STATUS_SUCCESS')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'SUCCESS');
          });
        this.search();
      });
  }

  exportUser() {
    let search = cloneDeep(this.searchForm.value);
    search.fromDate = moment(search.fromDate).format('YYYY-MM-DDT00:00:00');
    search.toDate = moment(search.toDate).format('YYYY-MM-DDT00:00:00');
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    this._customer.exportUser(search).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          const blob = response.body!;
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = `user-excel`;
          a.click();
          URL.revokeObjectURL(objectUrl);
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_CLEXPORT.EXPORT_SUCCESS')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'SUCCESS');
            });
        } else {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_CLEXPORT.EXPORT_SUCCESS')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      },
      error: (eror: any) => {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_CLEXPORT.EXPORT_ERROR')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      },
    });
  }

  openCreate() {
    this._dialogRef = this.dialog.open(CustomerAccountComponent, {
      width: '100%',
      disableClose: true,
    });
    this._dialogRef.componentInstance.userCreated.subscribe(
      (message: string) => {
        if (message === 'success') {
          this.search();
        }
      }
    );
  }

  editAcc(element: any) {
    this._customer.detailCustomer(element).subscribe((data: any) => {
      this._dialogRef = this.dialog.open(UpdateAccountComponent, {
        width: '100%',
        disableClose: true,
        data: { dataPass: data.result },
      });
      this._dialogRef.componentInstance.userUpdated.subscribe(
        (message: string) => {
          if (message === 'success') {
            this.search();
          }
        }
      );
    });
  }

  createContract(element: any) {
    this._dialogRef = this.dialog.open(CreateContractComponent, {
      width: '70%',
      height: '90%',
      disableClose: false,
      data: { dataPass: element },
    });
  }

  viewDetail(element: any) {
    this._customer.detailCustomer(element.customerId).subscribe((data: any) => {
      this.createdBy = data.result.createdBy;
      this.avatar = data.result.avatar;

      this.router.navigate(['/admin/management-customer/account-detail'], {
        state: {
          data: { element, createdBy: this.createdBy, avatar: this.avatar },
        },
      });
    });
  }

  deleteAcc(element: any) {
    this.translate
      .get('CONFIRMATION_ACCDELTE.DELETE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true,
              });
              this._customer.deleteCustomer(element).subscribe((data: any) => {
                if (data.errorCode === '000') {
                  loadingRef.close();
                  this.search();
                  this.translate
                    .get('NOTIFICATION_ACCDELETE.DELETE_SUCCESS')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(successMessage, 'SUCCESS');
                    });
                } else {
                  loadingRef.close();
                  this.translate
                    .get('NOTIFICATION_ACCDELETE.DELETE_FAIL')
                    .subscribe((failMessage: string) => {
                      this._alert.notify(failMessage, 'FAIL');
                    });
                }
              });
            }
          });
      });
  }

  search(offset = this.offset) {
    let search = cloneDeep(this.searchForm.value);
    search.page = this.offset = offset;
    search.size = this.size;

    if (search.fromDate) {
      search.fromDate = moment(search.fromDate).format('YYYY-MM-DDT00:00:00');
    }
    if (search.toDate) {
      search.toDate = moment(search.toDate).format('YYYY-MM-DDT00:00:00');
    }

    this._customer.searchCustomer(search).subscribe((data: any) => {
      this.searchData = data.result.content;
      this.totalOffset = data.result.totalPages - 1;
      this.offset = offset;
    });
  }
}
