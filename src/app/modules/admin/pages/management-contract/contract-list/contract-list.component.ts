import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { CreateNewContractComponent } from '../components/create-new-contract/create-new-contract.component';
import { EditNewContractComponent } from '../components/edit-new-contract/edit-new-contract.component';
import { NewContractDetailComponent } from '../components/new-contract-detail/new-contract-detail.component';
import { ManagementContractService } from '../management-contract.service';
import { cloneDeep } from 'lodash';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { PaginatorComponent } from '../../../../custom/paginator/paginator.component';
import * as moment from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionDirective } from '../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    SelectComponent,
    ReactiveFormsModule,
    MatIconModule,
    PaginatorComponent,
    MatProgressSpinnerModule,
    PermissionDirective,
    TranslateModule,
  ],
})
export class ContractListComponent implements OnInit {
  private modal!: MatDialogRef<any>;
  currentLang = 'vi';
  pass: any;
selectStatus: { value: string, label: string }[] = [];
  contractListForm!: FormGroup;

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;

  isLoading: boolean = false;

  searchContractList: any[] = [];

  // selectStatus = [
  //  { value: 'ALL', label: ('STATUS_ALL') },
  //     { value: 'COMPLETE', label: ('STATUS_COMPLETE') },
  //     { value: 'PENDING', label: ('STATUS_PENDING') },
  //     { value: 'CANCEL', label: ('STATUS_CANCEL') },
  //     { value: 'ACTIVE', label: ('STATUS_ACTIVE') },
  //     { value: 'END', label: ('STATUS_END') },
  // ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _manageContractService: ManagementContractService,
    private _alert: AlertService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
     this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
      this.initializeSelectStatus();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    });
    this.contractListForm = this.fb.group({
      userNamePhoneEmail: [''],
      contractCode: [''],
      fromAmount: [''],
      toAmount: [''],
      status: ['PENDING'],
      fromTime: [''],
      toTime: [''],
    });

    this.searchList();
  }
  reset() {
    this.contractListForm.reset({
      userNamePhoneEmail: '',
      contractCode: '',
      fromAmount: '',
      toAmount: '',
      status: 'PENDING',
      fromTime: '',
      toTime: '',
    });
    this.searchList();
  }

    initializeSelectStatus(): void {
    this.selectStatus = [
      { value: 'ALL', label: this.translate.instant('STATUS_ALL') },
      { value: 'COMPLETE', label: this.translate.instant('STATUS_COMPLETE') },
      { value: 'PENDING', label: this.translate.instant('STATUS_PENDING') },
      { value: 'CANCEL', label: this.translate.instant('STATUS_CANCEL') },
      { value: 'ACTIVE', label: this.translate.instant('STATUS_ACTIVE') },
      { value: 'END', label: this.translate.instant('STATUS_END') },
    ];
  }
  delete(id: string) {
    this.translate
      .get('CONFIRMATION_CLDELTE.DELETE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true,
              });
              const newStatus = 'DELETE';
              this._manageContractService
                .listChangeStatus({ id, status: newStatus })
                .subscribe((response: any) => {
                  if (response.errorCode === '000') {
                    loadingRef.close();
                    response.status = newStatus;
                    this.translate
                      .get('NOTIFICATION_CLDELETE.DELETE_SUCCESS')
                      .subscribe((successMessage: string) => {
                        this._alert.notify(successMessage, 'SUCCESS');
                      });
                    this.searchList();
                  } else {
                    loadingRef.close();
                    this.translate
                      .get('NOTIFICATION_CLDELETE.DELETE_FAIL')
                      .subscribe((failMessage: string) => {
                        this._alert.notify(failMessage, 'FAIL');
                      });
                  }
                });
            }
          });
      });
  }

  onCreateNewContract() {
    this.modal = this.dialog.open(CreateNewContractComponent, {
      height: '90%',
      width: '60%',
      disableClose: false,
      // panelClass: 'custom-modalbox'
    });
    this.modal.componentInstance.contractCreated.subscribe(
      (message: string) => {
        if (message === 'success') this.searchList();
      }
    );
  }

  editNewContract(id: string) {
    const _modal = this.dialog.open(EditNewContractComponent, {
      height: '90%',
      width: '60%',
      disableClose: false,
      data: { dataPass: id },
    });
    _modal.componentInstance.contractEdited.subscribe((message: string) => {
      if (message === 'success') this.searchList();
    });
  }
  formatCurrency(value: string): string {
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('vi-VN');
  }
  
  infoNewContract(data: string) {
    const _modal = this.dialog.open(NewContractDetailComponent, {
      height: '90%',
      width: '50%',
      disableClose: false,
      data: { dataPass: data },
    });
    _modal.componentInstance.approved.subscribe((message: string) => {
      if (message === 'success') {
        this.searchList();
      }
    });

    _modal.componentInstance.cancelled.subscribe((message: string) => {
      if (message === 'success') {
        this.searchList();
      }
    });
  }

  export() {
    let fromTime = moment(this.contractListForm.value.fromTime).format(
      'YYYY-MM-DD'
    );
    let toTime = moment(this.contractListForm.value.toTime).format(
      'YYYY-MM-DD'
    );

    let params = cloneDeep(this.contractListForm.value);
    if (params.status === 'ALL') {
      params.status = '';
    }
    if (params.fromTime) {
      params.fromTime = moment(params.fromTime).format('YYYY-MM-DDT00:00:00');
    }
    if (params.toTime) {
      params.toTime = moment(params.toTime).format('YYYY-MM-DDT00:00:00');
    }
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._manageContractService.export(params).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          const blob = response.body!;
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = `export-excel_${fromTime}_to_${toTime}.xlsx`;
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
      error: (error: any) => {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_CLEXPORT.EXPORT_ERROR')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      },
    });
  }

  searchList(offset: number = 0) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.isLoading = true;
    if (!this.contractListForm.invalid) {
      let form = cloneDeep(this.contractListForm.value);
      form.page = this.offset = offset;
      form.size = this.size;

      if (form.fromTime) {
        form.fromTime = moment(form.fromTime).format('YYYY-MM-DDT00:00:00');
      }
      if (form.toTime) {
        form.toTime = moment(form.toTime).format('YYYY-MM-DDT23:59:59');
      }

      if (form.status === 'ALL') {
        delete form.status;
      }
      this._manageContractService.list(form).subscribe((data: any) => {
        if (data.errorCode === '000') {
          loadingRef.close();
    this.isLoading = false;
          this.searchContractList = data.result.content;
          this.totalOffset = data.result.totalPages - 1;
        }
      }),
        (error: any) => {
          console.error('API Error:', error);
        };
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchList();
    }
  }
}
