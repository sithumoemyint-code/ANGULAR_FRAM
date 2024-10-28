import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { CustomerService } from '../../customer.service';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    InputComponent,
    TranslateModule,
  ],
})
export class UpdateAccountComponent implements OnInit {
  @Output() userUpdated = new EventEmitter<string>();
  updateForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  pass: any;
  user: any;
  editControl = new FormControl('');
  editSuggestions: boolean = false;
  editDataSuggestions: string[] = [];
  editData: {
    fullName: string;
    phoneNumber: string;
    assignAccountId: string;
    email: string;
  }[] = [];
  assignId: any;
  assignName: any;
  inputValue: any;
  selectStatus = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];
  gender = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private _dialogRef: MatDialogRef<UpdateAccountComponent>,
    private _alert: AlertService,
    private _customer: CustomerService,
    private _dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.pass = data.dataPass;
  }

  ngOnInit(): void {
    this.getAllAdmin();
    const formattedBirthday = this.formatDateToISO(this.pass.birthDay);

    this.updateForm = this.fb.group({
      fullName: [this.pass.fullName, Validators.required],
      phoneNumber: [
        this.pass.phoneNumber,
        [
          Validators.required,
          Validators.pattern(
            '^(?:\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8-9]|9[0-9])\\d{7}$'
          ),
        ],
      ],
      email: [this.pass.email],
      birthDay: [formattedBirthday, Validators.required],
      status: [this.pass.status, Validators.required],
      address: [this.pass.address],
      gender: [this.pass.gender, Validators.required],
      zaloAccount: [this.pass.zaloAccount],
      facebookAccount: [this.pass.facebookAccount],
      note: [this.pass.note],
      referenceAccountId: [
        this.pass.referenceAccount.fullName,
        Validators.required,
      ],
    });

    this.editControl.setValue(
      this.updateForm.get('referenceAccountId')?.value || ''
    );
    this.editControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.inputValue = value;
      this.onInputChange(value || '');
    });
    this.updateForm
      .get('referenceAccountId')
      ?.valueChanges.subscribe((value) =>
        this.editControl.setValue(value, { emitEvent: false })
      );
  }

  formatDateToISO(dateString: string): string {
    const parts = dateString.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    return `${year}-${month}-${day}`;
  }

  close() {
    this._dialogRef.close();
  }

  update() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
    } else {
      this.translate
        .get('CONFIRMATION_ACCSUPDATE.UPDATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this.close();
                this._onUpdate();
              }
            });
        });
    }
  }

  _onUpdate() {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    const res = this.editData.find(
      (item: any) => item.fullName === this.updateForm.value.referenceAccountId
    );
    const result = this.assignId;
    delete this.updateForm.value.referenceAccountId;
    let create = cloneDeep(this.updateForm.value);
    create.referenceAccountId = result;
    create.birthDay = moment(create.birthDay).format('DD/MM/YYYY');

    this._customer
      .updateCustomer(this.pass.customerId, create)
      .subscribe((data: any) => {
        if (data.errorCode === '000') {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_ACCSUPDATE.UPDATE_SUCCESS')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'SUCCESS');
            });
          this.userUpdated.emit('success');
        } else {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_ACCSUPDATE.UPDATE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
  }

  hideSuggestions() {
    this.updateForm.get('referenceAccountId')?.markAsTouched();
    setTimeout(() => (this.editSuggestions = false), 200);
  }

  selectSuggestion(suggestion: string) {
    const [fullName, phoneNumber] = suggestion.split(' - ');
    this.updateForm.get('referenceAccountId')?.setValue(suggestion);
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
