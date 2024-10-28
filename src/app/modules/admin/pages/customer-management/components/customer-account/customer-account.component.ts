import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { debounceTime } from 'rxjs';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { CustomerService } from '../../customer.service';
import * as moment from 'moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class CustomerAccountComponent implements OnInit {
  @Output() userCreated = new EventEmitter<string>();
  lang: any;
  today: string = new Date().toISOString().split('T')[0];
  createForm!: FormGroup;
  user: any;
  email: any;
  selectStatus = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];
  gender = [
    { value: 'MALE', label: 'Male', labelVi: 'Nam' },
    { value: 'FEMALE', label: 'Female', labelVi: 'Nữ' },
  ];
  assignId: any;
  assignName: any;
  editControl = new FormControl('');
  editSuggestions: boolean = false;
  editDataSuggestions: string[] = [];
  editData: {
    fullName: string;
    phoneNumber: string;
    assignAccountId: string;
    email: string;
  }[] = [];
  inputValue: any;

  constructor(
    private fb: FormBuilder,
    private _dialogRef: MatDialogRef<CustomerAccountComponent>,
    private _alert: AlertService,
    private _customer: CustomerService,
    private translate: TranslateService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllAdmin();
    this.lang = localStorage.getItem('language');

    this.createForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?:\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8-9]|9[0-9])\\d{7}$'
          ),
        ],
      ],
      email: [''],
      birthDay: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      address: [''],
      gender: ['MALE', Validators.required],
      zaloAccount: [''],
      facebookAccount: [''],
      note: [''],
      referenceAccountId: ['', Validators.required],
    });

    this.editControl.setValue(
      this.createForm.get('referenceAccountId')?.value || ''
    );
    this.editControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.inputValue = value;
      this.onInputChange(value || '');
    });
    this.createForm
      .get('referenceAccountId')
      ?.valueChanges.subscribe((value) =>
        this.editControl.setValue(value, { emitEvent: false })
      );
  }

  get genderOptions() {
    return this.gender.map((option) => ({
      value: option.value,
      label: this.lang === 'en' ? option.label : option.labelVi,
    }));
  }

  close() {
    this._dialogRef.close();
    this.createForm.reset({
      fullName: [''],
      phoneNumber: [''],
      email: [''],
      birthDay: [''],
      status: ['ACTIVE'],
      address: [''],
      gender: ['MALE'],
      zaloAccount: [''],
      facebookAccount: [''],
      note: [''],
      referenceAccountId: [''],
    });
  }

  createCustomer() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
    } else {
      if (this.createForm.get('email')?.value === '') {
        const phoneNumber = this.createForm.get('phoneNumber')?.value;
        this.translate
          .get('CONFIRMATION_ACCCREATE.CREATE', { phoneNumber })
          .subscribe((confirmationMessage: string) => {
            this._alert
              .confirm(confirmationMessage)
              .subscribe((result: boolean) => {
                if (result) {
                  this._dialogRef.close();
                  this._confirmCreateCustomer();
                }
              });
          });
      } else {
        this.translate
          .get('CONFIRMATION_ACCCREATE.CREATE_T')
          .subscribe((confirmationMessage: string) => {
            this._alert
              .confirm(confirmationMessage)
              .subscribe((result: boolean) => {
                if (result) {
                  this._dialogRef.close();
                  this._confirmCreateCustomer();
                }
              });
          });
      }
    }
  }

  selectSuggestion(suggestion: string) {
    const [fullName, phoneNumber] = suggestion.split(' - ');
    this.createForm.get('referenceAccountId')?.setValue(suggestion);
    const selectedItem = this.editData.find(
      (item) =>
        item.fullName.toLowerCase() === fullName.toLowerCase() &&
        item.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()
    );

    if (selectedItem) {
      this.assignId = selectedItem.assignAccountId;

      this.assignName = selectedItem.fullName;
    }
    this.editDataSuggestions = [];
  }

  onInputChange(value: string) {
    if (value) {
      const lowerCaseValue = value.toLowerCase();
      const isPhoneNumberSearch = !isNaN(
        Number(lowerCaseValue.replace(/\s+/g, ''))
      );

      this.editDataSuggestions = this.editData
        .filter((item) => {
          const itemPhoneNumber = item.phoneNumber.toLowerCase();
          const itemFullName = item.fullName.toLowerCase();
          if (isPhoneNumberSearch) {
            return itemPhoneNumber.includes(lowerCaseValue);
          } else {
            return itemFullName.includes(lowerCaseValue);
          }
        })
        .map((item) => `${item.fullName} - ${item.phoneNumber}`);
    } else {
      this.editDataSuggestions = [];
      this.inputValue = '';
    }
  }

  hideSuggestions() {
    this.createForm.get('referenceAccountId')?.markAsTouched();
    setTimeout(() => (this.editSuggestions = false), 200);
  }

  _confirmCreateCustomer() {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    delete this.createForm.value.referenceAccountId;
    let create = cloneDeep(this.createForm.value);
    create.referenceAccountId = this.assignId;
    create.birthDay = moment(create.birthDay).format('DD/MM/YYYY');
    this._customer.createCustomer(create).subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_CCREATE.CREATE_SUCCESS')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'SUCCESS');
          });
        this.userCreated.emit('success');
      } else {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_CCREATE.CREATE_FAIL')
          .subscribe((message: string) => {
            this._alert.notify(data.message || message, 'FAIL');
          });
      }
    });
  }

  getAllAdmin() {
    this._customer.adminList().subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.user = data.result;
        this.editData = data.result.map(
          (item: { fullName: any; accountId: any; phoneNumber: any }) => ({
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            assignAccountId: item.accountId,
          })
        );
      } else {
        this.translate
          .get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      }
    });
  }
}
