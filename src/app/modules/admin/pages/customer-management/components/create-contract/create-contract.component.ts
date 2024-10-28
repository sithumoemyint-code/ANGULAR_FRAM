import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { combineLatest, debounceTime } from 'rxjs';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ManagementContractService } from '../../../management-contract/management-contract.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    SelectComponent,
    TranslateModule,
    MatIconModule,
  ],
})
export class CreateContractComponent implements OnInit {
  @Output() contractCreated = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput: any;

  createForm!: FormGroup;
  pass: any;
  package: any[] = [];
  packages: any[] = [];
  allAdmin: any[] = [];
  assignId: any;
  assignName: any;
  customerId: any;
  matchedPackage: any;
   isLoading = true;

  editControl = new FormControl('');
  editSuggestions: boolean = false;
  editDataSuggestions: string[] = [];
  editData: {
    fullName: string;
    phoneNumber: string;
    accountId: string;
    email: string;

  }[] = [];
  aContract: any[] = [];
  currentLang = 'vi';
  history: any;
  inputValue: any;
assignPhoneNumber : any
  files: File[] = [];

  currency = [
    { value: 'VND', label: 'VND' },
    // { value: 'USD', label: 'USD' },
  ];
  // status = [
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'ACTIVE', label: 'Active' },
  //   { value: 'CANCEL', label: 'Cancel' },
  //   { value: 'END', label: 'End' },
  //   { value: 'COMPLETE', label: 'Complete' },
  // ];
status: { value: string, label: string }[] = [];

  statusPeriod = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _dialogRef: MatDialogRef<CreateContractComponent>,
    private _alert: AlertService,
    private manageContractService: ManagementContractService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private _uploadImage: UploadImageService
  ) {
    this.pass = data.dataPass;
  }

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
           this.initializeSelectStatus();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    });

    this.createForm = this.fb.group({
      customerName: [this.pass.fullName ],
      phoneNumber: [this.pass.phoneNumber],
      email: [this.pass.email],
      packageName: this.fb.group(
        {
          vi: ['', Validators.required],
          en: ['', Validators.required],
        },
        { validators: this.languageRequiredValidator(this.currentLang) }
      ),

      signatoryId: ['', Validators.required],
      contractCode: ['', Validators.required],
      investAmount: ['', Validators.required],
      currency: ['VND', Validators.required],
      status: ['PENDING', Validators.required],
      term: ['', Validators.required],
      interestPaymentPeriod: ['', Validators.required],
      interestRate: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)],
      ],
      bonusRate: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)],
      ],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      interestPaymentHistories: this.fb.array([]),

      settlementAmount: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],

      gift: this.fb.group({
        vi: [''],
        en: [''],
      }),
      settlementDate: [''],
      reason: [''],

      files: this.fb.array([]),

    });

    this.editControl.setValue(this.createForm.get('signatoryId')?.value || '');

    this.editControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) =>
      {
        this.inputValue =  value || '';
        this.onInputChange(this.inputValue)
      }
        );
    this.createForm
      .get('signatoryId')
      ?.valueChanges.subscribe((value: any) =>
        this.createForm.setValue(value, { emitEvent: false })
      );

    this.getAllPackages();
    this.patchValuePack();
    this.datePatch();
    this.fetchAllAdminAcc();
    this.addPaymentDetail();

    const investAmountControl = this.createForm.get('investAmount');
    const fromTimeControl = this.createForm.get('fromTime');

    combineLatest([
      investAmountControl?.valueChanges.pipe(debounceTime(1000)),
      fromTimeControl?.valueChanges.pipe(debounceTime(1000)),
    ]).subscribe(([]) => {
      if (investAmountControl?.valid && fromTimeControl?.valid) {
        this.checkPaymentHistories();
      }
    });
  }
 initializeSelectStatus(): void {
    this.status = [
      { value: 'COMPLETE', label: this.translate.instant('STATUS_COMPLETE') },
      { value: 'PENDING', label: this.translate.instant('STATUS_PENDING') },
      { value: 'CANCEL', label: this.translate.instant('STATUS_CANCEL') },
      { value: 'ACTIVE', label: this.translate.instant('STATUS_ACTIVE') },
      { value: 'END', label: this.translate.instant('STATUS_END') },
    ];
  }
   get forms() {
    return this.createForm.get('files') as FormArray;
  }

  languageRequiredValidator(lang: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (lang === 'vi' && !control.get('vi')?.value) {
        return { viRequired: true };
      }
      if (lang === 'en' && !control.get('en')?.value) {
        return { enRequired: true };
      }
      return null;
    };
  }
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = inputElement.value.replace(/[^0-9]/g, '');
    this.createForm.get('investAmount')?.setValue(numericValue);
    
    inputElement.value = this.formatCurrency(numericValue);
  }

  formatCurrency(value: string): string {
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('vi-VN');
  }

  onSettlementAmountInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const numericValue = inputElement.value.replace(/[^0-9]/g, '');
  this.createForm.get('settlementAmount')?.setValue(numericValue);

  inputElement.value = this.formatCurrency(numericValue);
}

  
onInterestPaymentInput(event: Event, index: number) {
  const inputElement = event.target as HTMLInputElement;
  const numericValue = inputElement.value.replace(/[^0-9]/g, '');
  this.paymentDetails.at(index).get('interestPaymentAmount')?.setValue(numericValue);

  inputElement.value = this.formatCurrency(numericValue);
}
  createPaymentDetail(): FormGroup {
    return this.fb.group({
      paymentPeriodTime: [''],
      status: ['PAID'],
      interestPaymentAmount: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      note: [''],
    });
  }
  get paymentDetails(): FormArray {
    return this.createForm.get('interestPaymentHistories') as FormArray;
  }

  addPaymentDetail() {
    (this.createForm.get('interestPaymentHistories') as FormArray).push(
      this.createPaymentDetail()
    );
  }

  getAllPackages() {
    this.manageContractService.allPackages().subscribe((data: any) => {
      const loadingRef = this.dialog.open(ApiLoadingComponent, {
        disableClose: true,
      });
      if (data.errorCode === '000') {
        loadingRef.close();
        this.package = data.result;

        this.packages = data.result.map(
          (item: {
            name: { vi: any; en: any };
            service: { vi: any; en: any };
            id: any;
          }) => ({
            value: this.currentLang === 'vi' ? item.name.vi : item.name.en,
            label: this.currentLang === 'vi' ? item.name.vi : item.name.en,
            service: {
              vi: item.service.vi,
              en: item.service.en,
            },
            id: item.id,
          })
        );

        if (this.packages.length > 0) {
          this.createForm.patchValue({
            packageName: {
              vi: this.currentLang === 'vi' ? this.packages[0].value : '',
              en: this.currentLang === 'en' ? this.packages[0].value : '',
            },
          });
        } else {
          loadingRef.close();
           this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                  this._alert.notify(failMessage, 'FAIL');
                });
        }
      }
    });
  }
  patchValuePack() {
    this.createForm.get('packageName')?.valueChanges.subscribe((value) => {
      if (value) {
        this.matchedPackage = this.package.find(
          (pkg) => pkg.name.vi === value.vi || pkg.name.en === value.en
        );
        this.createForm.patchValue({
          term: this.matchedPackage?.term,
          interestPaymentPeriod: this.matchedPackage?.paymentPeriod,
          interestRate: this.matchedPackage?.interestRate,
          bonusRate: this.matchedPackage?.bonusRate,
        });
      }
    });
  }

  checkPaymentHistories() {
   this.isLoading = true;
    const investAmountControl = this.createForm.get('investAmount');
    const fromTimeControl = this.createForm.get('fromTime');

    if (investAmountControl?.valid && fromTimeControl?.valid) {
      const amount = investAmountControl.value;
      const date = moment(fromTimeControl.value).format('YYYY-MM-DDT00:00:00');

      const data = {
        packageId: this.matchedPackage.id,
        totalInvestmentAmount: amount,
        startDate: date,
      };

      this.manageContractService.getInterest(data).subscribe((data: any) => {
        if (data.errorCode === '000') {
        this.isLoading = false;
          this.history = data.result;
          const historyArray = this.createForm.get(
            'interestPaymentHistories'
          ) as FormArray;
          historyArray.clear();
          this.history.forEach((item: any) => {
            if (item.paymentPeriodTime) {
              item.paymentPeriodTime = moment(item.paymentPeriodTime).format(
                'YYYY-MM-DD'
              );
            }
             if (item.interestPaymentAmount) {
            item.interestPaymentAmount = this.formatCurrency(item.interestPaymentAmount)
          }
            const paymentDetail = this.createPaymentDetail();
            paymentDetail.patchValue(item);
            paymentDetail.patchValue(item);
            historyArray.push(paymentDetail);
          });
        }
      });
    }
  }

  datePatch() {
    this.createForm.get('fromTime')?.valueChanges.subscribe((value) => {
      const term = this.createForm.get('term')?.value;
      if (value && term) {
        const dateValue = new Date(value);
        dateValue.setMonth(dateValue.getMonth() + Number(term));
        const newDateValue = dateValue.toISOString().split('T')[0];
        this.createForm.patchValue({
          toTime: newDateValue,
        });
      }
    });
  }

  fetchAllAdminAcc() {
    this.manageContractService.getAllAdminAcc().subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.allAdmin = data.result;

        this.editData = data.result.map(
          (item: {
            fullName: any;
            accountId: any;
            phoneNumber: any;
            email: any;
          }) => ({
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            accountId: item.accountId,
            email: item.email,
          })
        );
      } else {
        this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                  this._alert.notify(failMessage, 'FAIL');
                });
      }
    });
  }

  onInputChange(event: Event) {
       const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;
  this.inputValue = value;
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
            return itemPhoneNumber.startsWith(lowerCaseValue);
          } else {
            return itemFullName.startsWith(lowerCaseValue);
          }
        })
        .map((item) => `${item.fullName} - ${item.phoneNumber}`);
       if (this.editDataSuggestions.length === 0) {
      this.createForm.get('signatoryId')?.setErrors({ notFound: true });
    } 
    } else {
      this.editDataSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    const [fullName, phoneNumber] = suggestion.split(' - ');
    this.createForm.get('signatoryId')?.setValue(suggestion);
    const selectedItem = this.editData.find(
      (item) =>
        item.fullName.toLowerCase() === fullName.toLowerCase() &&
        item.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()
    );
    if (selectedItem) {
      this.assignId = selectedItem.accountId;
      this.assignName = selectedItem.fullName;
      this.assignPhoneNumber = selectedItem.phoneNumber;

    }
    this.editDataSuggestions = [];
    this.inputValue = '';
  }

  hideSuggestions() {
    this.createForm.get('signatoryId')?.markAsTouched();
    setTimeout(() => (this.editSuggestions = false), 200);
  }

  onOptionSelected(option: string) {
    console.log('Selected option:', option);
  }

   onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('type', 'CONTRACT');

      this._uploadImage.uploadImage(formData).subscribe(
        (data: any) => {
          if (data.errorCode === '000') {
            const imageUrl = data.result;

            const filesArray = this.createForm.get('files') as FormArray;
            // filesArray.push(this.fb.control(file.name));
            // this.files.push(file);
            filesArray.push(this.fb.control(imageUrl));
            const filename = imageUrl.split('/').pop();
            this.files.push(filename);
          } else {
            console.error('Upload failed:', data);
          }
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          loadingRef.close();
        }
      );
    }

    this.fileInput.nativeElement.value = '';
  }

  downloadFile(filePath: any): void {
  const baseUrl = 'http://45.76.158.94:9002/giftlife/contract/'; 
  const fullPath = baseUrl + filePath; 

  const link = document.createElement('a');
    link.href = fullPath;
      link.setAttribute('download', filePath); 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  }
  

    removeFile(index: number) {
    this.forms.removeAt(index);
    this.files.splice(index, 1);
  }
  close() {
    this._dialogRef.close();
  }

  create() {
    const packageN = this.createForm.get('packageName')?.value;
    this.matchedPackage = this.package.find(
      (pkg) => pkg.name.vi === packageN.vi || pkg.name.en === packageN.en
    );

    if (this.matchedPackage) {
      this.createForm.patchValue({
        packageName: {
          vi: this.matchedPackage.name.vi,
          en: this.matchedPackage.name.en,
        },
      });
    }
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
    } else {
    
      this.translate
        .get('CONFIRMATION_CLCREATE.CREATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this.createContract();
              }
            });
        });
    }
  }

  createContract() {
    const contract = cloneDeep(this.createForm.value);
    const packageName = this.createForm.value.packageName;
    const service = this.packages.find(
      (item) => item.label === packageName?.vi || item.label === packageName?.en
    )?.service;
    const targetLabel = packageName?.vi || packageName?.en;
    const packId = this.packages.find((item) => item.label === targetLabel)?.id;
    contract.fromTime = moment(contract.fromTime).format('YYYY-MM-DDT00:00:00');
    contract.toTime = moment(contract.toTime).format('YYYY-MM-DDT00:00:00');
    contract.settlementDate = moment(contract.toTime).format(
      'YYYY-MM-DDT00:00:00'
    );
    contract.interestPaymentHistories.forEach((history: any) => {
      if (history.paymentPeriodTime) {
        history.paymentPeriodTime = moment(history.paymentPeriodTime).format(
          'YYYY-MM-DDT00:00:00'
        );
      }    if (history.interestPaymentAmount) {
        history.interestPaymentAmount = parseFloat(history.interestPaymentAmount.replace(/\./g, ''));
      }
    });

    if (contract.settlementAmount) {
                 contract.settlementAmount = parseFloat(contract.settlementAmount.replace(/\./g, ''));
              }
    if (contract.packageName) {
      contract.packageName = {
        vi: this.matchedPackage.name.vi,
        en: this.matchedPackage.name.en,
      };
    }
    contract.packageId = this.matchedPackage.id;

    contract.currency = this.createForm.get('currency')?.value;
    contract.accountId = this.pass.customerId;
    contract.signatoryId = this.assignId;
    contract.signatoryFullName = this.assignName;
    contract.signatoryPhoneNumber = this.assignPhoneNumber;

    contract.customerName = this.pass.fullName;
    contract.phoneNumber = this.pass.phoneNumber;
    contract.email = this.pass.email;
    if (service) {
      contract.service = {
        vi: this.matchedPackage.service.vi,
        en: this.matchedPackage.service.en,
      };
    }

    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.manageContractService
      .createContract(contract)
      .subscribe((data: any) => {
        if (data.errorCode === '000') {
          loadingRef.close();
          this.aContract = data.result;
          this.translate
            .get('NOTIFICATION_CLCREATE.CREATE_SUCCESS')
            .subscribe((successMessage: string) => {
                if (this.dialog) {
        this._dialogRef.close();
      }
              this._alert.notify(successMessage, 'SUCCESS');
            });
          this.contractCreated.emit('success');
        }
        else if (data.errorCode === '100') {
          loadingRef.close();
          this._alert.notify(data.message, 'FAIL')
        }
        else {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_CLCREATE.CREATE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
  }
}
