import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../../../custom/input/input.component';
import { SelectComponent } from '../../../../custom/select/select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestContractsDetailComponent } from '../components/request-contracts-detail/request-contracts-detail.component';
import { EditRequestContractsComponent } from '../components/edit-request-contracts/edit-request-contracts.component';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { ManagementContractService } from '../management-contract.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { PermissionDirective } from '../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-request-contracts',
  templateUrl: './request-contracts.component.html',
  styleUrls: ['./request-contracts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    SelectComponent,
    ReactiveFormsModule,
    PaginatorComponent,
    MatIconModule,
    PermissionDirective,
    TranslateModule,
  ],
})
export class RequestContractsComponent implements OnInit {
  private modal!: MatDialogRef<any>;

  requestContractsForm!: FormGroup;
  currentLang = 'vi';
  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;

  isLoading: boolean = false;

  contractList: any[] = [];
selectStatus: { value: string, label: string }[] = [];

  // selectStatus = [
  //   { value: 'ALL', label: 'All' },
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'IN_PROGRESS', label: 'In Progress' },
  //   { value: 'COMPLETE', label: 'Complete' },
  // ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _requestContractService: ManagementContractService,
    private _alert: AlertService,
    private translate: TranslateService,
    private languageService : LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
       this.initializeSelectStatus();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    });
    this.requestContractsForm = this.fb.group({
      userNamePhoneEmail: [''],
      fromAmount: [''],
      toAmount: [''],
      status: ['ALL'],
      fromTime: [''],
      toTime: [''],
    });
    this.searchContractList();
  }
  initializeSelectStatus(): void {
    this.selectStatus = [
      { value: 'ALL', label: this.translate.instant('STATUS_ALL') },
      { value: 'PENDING', label: this.translate.instant('STATUS_PENDING') },
      { value: 'IN_PROGRESS', label: this.translate.instant('STATUS_IN_PROGRESS') },
      { value: 'COMPLETE', label: this.translate.instant('STATUS_COMPLETE') },
    ];
  }
  reset() {
    this.requestContractsForm.reset({
      userNamePhoneEmail: '',
      fromAmount: '',
      toAmount: '',
      status: 'ALL',
      fromTime: '',
      toTime: '',
    });
    this.searchContractList();
  }

  delete(id: string) {
    this.translate
      .get('CONFIRMATION_CDELTE.DELETE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true,
              });
              const newStatus = 'DELETE';
              this._requestContractService
                .changeStatus({ id, status: newStatus })
                .subscribe((response: any) => {
                  if (response.errorCode === '000') {
                    loadingRef.close();
                    response.status = newStatus;
                    this.translate
                      .get('NOTIFICATION_CDELETE.DELETE_SUCCESS')
                      .subscribe((successMessage: string) => {
                        this._alert.notify(successMessage, 'SUCCESS');
                      });
                    this.searchContractList();
                  } else {
                    loadingRef.close();
                    this.translate
                      .get('NOTIFICATION_CDELETE.DELETE_FAIL')
                      .subscribe((failMessage: string) => {
                        this._alert.notify(failMessage, 'FAIL');
                      });
                  }
                });
            }
          });
      });
  }

  infoDetail(id: string) {
    this.dialog.open(RequestContractsDetailComponent, {
      height: '90%',
      width: '50%',
      disableClose: false,
      data: { dataPass: id },
    });
  }

  editInfo(data: string) {
    this.modal = this.dialog.open(EditRequestContractsComponent, {
      height: '90%',
      width: '50%',
      disableClose: true,
      data: { dataPass: data },
    });

    this.modal.componentInstance.editContract.subscribe((message: string) => {
      if (message === 'success') this.searchContractList();
    });
  }

  searchContractList(offset: number = 0) {
    if (!this.requestContractsForm.invalid) {
      this.requestContractsForm.markAllAsTouched();
      let searchList = cloneDeep(this.requestContractsForm.value);
      if (searchList.status === 'ALL') {
        delete searchList.status;
      }
      searchList.page = this.offset = offset;
      searchList.size = this.size;
      if (searchList.fromTime) {
        searchList.fromTime = moment(searchList.fromTime).format(
          'YYYY-MM-DDT00:00:00'
        );
      }
      if (searchList.toTime) {
        searchList.toTime = moment(searchList.toTime).format(
          'YYYY-MM-DDT23:59:59'
        );
      }

      if (searchList.fromAmount)
        searchList.fromAmount = searchList.fromAmount.replace(/,/g, '');
      if (searchList.toAmount)
        searchList.toAmount = searchList.toAmount.replace(/,/g, '');

      this.isLoading = true;
      this._requestContractService
        .searchList(searchList)
        .subscribe((data: any) => {
          if (data.errorCode === '000') {
            this.isLoading = false;
            this.contractList = data.result.content;
          } else {
            this.translate
              .get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL')
              .subscribe((failMessage: string) => {
                this._alert.notify(failMessage, 'FAIL');
              });
          }
          this.totalOffset = data.result.totalPages - 1;
        });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchContractList();
    }
  }
}
