import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
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
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, debounceTime, Subscription } from 'rxjs';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { ManagementContractService } from '../../management-contract.service';
import { AlertService } from 'src/app/modules/service/alert.service';
import { cloneDeep } from 'lodash';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import * as moment from 'moment';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-create-new-contract',
  templateUrl: './create-new-contract.component.html',
  styleUrls: ['./create-new-contract.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
    ReactiveFormsModule,
    InputComponent,
    MatIconModule,
    TranslateModule,
  ],
})
export class CreateNewContractComponent implements OnInit, OnDestroy {
  private packageNameSubscription!: Subscription;
  private fromTimeSubscription!: Subscription;
  @Output() contractCreated = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput: any;
  files: File[] = [];
  isLoading = true;
  createNewContract!: FormGroup;
  editControl = new FormControl('');
  editSuggestions: boolean = false;
  editDataSuggestions: string[] = [];
  editData: {
    fullName: string;
    phoneNumber: string;
    accountId: string;
    email: string;
  }[] = [];

  editCustomerControl = new FormControl('');
  editCustomerSuggestions: boolean = false;
  editCustomerDataSuggestions: string[] = [];
  editCustomerData: {
    customerId: any;
    fullName: any;
    phoneNumber: any;
    email: any;
  }[] = [];

  package: any[] = [];
  packages: any[] = [];

  allAdmin: any[] = [];
  allCustomer: any[] = [];
  assignId: any;
  assignName: any;
  assignPhoneNumber: any;
  customerName: any;
  customerId: any;
  currentLang = 'vi';
  cusPhoneNumber: any;
  cusEmail: any;
  matchedPackage: any;
  history: any;
  aContract: any[] = [];
  inputValue: any;
  inputCusValue: any;
  formattedValue: any;
  currency = [
    { value: 'VND', label: 'VND' },
    // { value: 'USD', label: 'USD' },
  ];
status: { value: string, label: string }[] = [];
statusPeriod: { value: string, label: string }[] = [];


  // status = [
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'ACTIVE', label: 'Active' },
  //   { value: 'CANCEL', label: 'Cancel' },
  //   { value: 'END', label: 'End' },
  //   { value: 'COMPLETE', label: 'Complete' },
  // ];

  // statusPeriod = [
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'PAID', label: 'Paid' },
  // ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateNewContractComponent>,
    private manageContractService: ManagementContractService,
    private _alert: AlertService,
    private _uploadImage: UploadImageService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    this.initializeSelectStatus();
    this.period()
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    this.period()

    });
    const currentDate = moment().format('YYYY-MM-DDT00:00:00');
    this.createNewContract = this.fb.group({
      packageName: this.fb.group({
        vi: ['', Validators.required],
        en: ['', Validators.required],
      }),
      customerName: ['', Validators.required],
      signatoryId: ['', Validators.required],
      contractCode: ['', Validators.required],
      investAmount: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)],
      ],
      currency: ['VND', Validators.required],
      status: ['ACTIVE', Validators.required],
      term:  [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)],
      interestPaymentPeriod: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
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
      settlementDate: [currentDate],
      reason: [''],

      files: this.fb.array([]),
    });

    this.editControl.setValue(
      this.createNewContract.get('signatoryId')?.value || ''
    );

    this.editControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.inputValue = value || '';
      this.onInputChange(this.inputValue);
    });

    this.createNewContract
      .get('signatoryId')
      ?.valueChanges.subscribe((value) =>
        this.editControl.setValue(value, { emitEvent: false })
      );

    this.editCustomerControl.setValue(
      this.createNewContract.get('customerName')?.value || ''
    );

    this.editCustomerControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.inputCusValue = value || '';
        this.onInputCustomerChange(this.inputCusValue);
      });

    this.createNewContract
      .get('customerName')
      ?.valueChanges.subscribe((value) =>
        this.editCustomerControl.setValue(value, { emitEvent: false })
      );

    this.getAllPackages();
    this.patchValuePack();
    this.datePatch();
    this.fetchAllAdminAcc();
    this.fetchAllCustomerAcc();
    this.addPaymentDetail();

    const investAmountControl = this.createNewContract.get('investAmount');
    const fromTimeControl = this.createNewContract.get('fromTime');

    combineLatest([
      investAmountControl?.valueChanges.pipe(debounceTime(1000)),
      fromTimeControl?.valueChanges.pipe(debounceTime(1000)),
    ]).subscribe(([]) => {
      if (investAmountControl?.valid && fromTimeControl?.valid) {
        this.checkPaymentHistories();
      }
    });
  }
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = inputElement.value.replace(/[^0-9]/g, '');
    this.createNewContract.get('investAmount')?.setValue(numericValue);
    this.formattedValue = this.formatCurrency(numericValue);

    inputElement.value = this.formatCurrency(numericValue);
  }

  formatCurrency(value: string): string {
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('vi-VN');
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

    period(): void {
    this.statusPeriod = [
        { value: 'PENDING', label: this.translate.instant('STATUS_PENDING') },
    { value: 'PAID', label:  this.translate.instant('STATUS_PAID') },
    ];
  }
  onSettlementAmountInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = inputElement.value.replace(/[^0-9]/g, '');
    this.createNewContract.get('settlementAmount')?.setValue(numericValue);

    inputElement.value = this.formatCurrency(numericValue);
  }

  onInterestPaymentInput(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = inputElement.value.replace(/[^0-9]/g, '');
    this.paymentDetails
      .at(index)
      .get('interestPaymentAmount')
      ?.setValue(numericValue);

    inputElement.value = this.formatCurrency(numericValue);
  }

  createPaymentDetail(): FormGroup {
    const currentDate = moment().format('YYYY-MM-DDT00:00:00');
    return this.fb.group({
      paymentPeriodTime: [currentDate],
      status: ['PENDING'],
      interestPaymentAmount: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      note: [''],
    });
  }
  get paymentDetails(): FormArray {
    return this.createNewContract.get('interestPaymentHistories') as FormArray;
  }

  addPaymentDetail() {
    (this.createNewContract.get('interestPaymentHistories') as FormArray).push(
      this.createPaymentDetail()
    );
  }
  downloadFile(filePath: any): void {
    const baseUrl = 'http://45.76.158.94:9002/giftlife/contract/';
    const fullPath = baseUrl + filePath;

    const link = document.createElement('a');
    link.href = fullPath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  get forms() {
    return this.createNewContract.get('files') as FormArray;
  }

  checkPaymentHistories() {
    this.isLoading = true;
    const investAmountControl = this.createNewContract.get('investAmount');
    const fromTimeControl = this.createNewContract.get('fromTime');

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
          this.history = data.result;
          this.isLoading = false;
          const historyArray = this.createNewContract.get(
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
              item.interestPaymentAmount = this.formatCurrency(
                item.interestPaymentAmount
              );
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
  getAllPackages() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.manageContractService.allPackages().subscribe((data: any) => {
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
          this.createNewContract.patchValue({
            packageName: {
              vi: this.currentLang === 'vi' ? this.packages[0].value : '',
              en: this.currentLang === 'en' ? this.packages[0].value : '',
            },
          });
        } else {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_NSTATUS.NO_PACKAGE')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      }
    });
  }

  patchValuePack() {
    this.packageNameSubscription = this.createNewContract
      .get('packageName')!
      .valueChanges.subscribe((value) => {
        if (value) {
          this.matchedPackage = this.package.find(
            (pkg) => pkg.name.vi === value.vi || pkg.name.en === value.en
          );
          this.createNewContract.patchValue({
            term: this.matchedPackage?.term,
            interestPaymentPeriod: this.matchedPackage?.paymentPeriod,
            interestRate: this.matchedPackage?.interestRate,
            bonusRate: this.matchedPackage?.bonusRate,
          });
        }
      });
  }

  datePatch() {
    this.fromTimeSubscription = this.createNewContract
      .get('fromTime')!
      .valueChanges.subscribe((value) => {
        const term = this.createNewContract.get('term')?.value;
        if (value && term) {
          const dateValue = new Date(value);
          dateValue.setMonth(dateValue.getMonth() + Number(term));
          const newDateValue = dateValue.toISOString().split('T')[0];
          this.createNewContract.patchValue({
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
        this.translate
          .get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      }
    });
  }

  fetchAllCustomerAcc() {
    this.manageContractService.allCustomer().subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.allCustomer = data.result.content;

        this.editCustomerData = data.result.content.map(
          (item: {
            fullName: any;
            phoneNumber: any;
            customerId: any;
            email: any;
          }) => ({
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            customerId: item.customerId,
            email: item.email,
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

  onInputChange(event: Event) {
       const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;
  this.inputValue = value;
    if (value) {
      // this.inputValue = value
      const lowerCaseValue = value.toLowerCase();
      const isPhoneNumberSearch = !isNaN(
        Number(lowerCaseValue.replace(/\s+/g, ''))
      );

      this.editDataSuggestions = this.editData
        .filter((item) => {
          const itemPhoneNumber = item.phoneNumber.toLowerCase();
          const itemFullName = item.fullName.toLowerCase();
          if (isPhoneNumberSearch) {
            // return itemPhoneNumber.startsWith(lowerCaseValue);
            return itemPhoneNumber.includes(lowerCaseValue);
          } else {
            // return itemFullName.startsWith(lowerCaseValue);
            return itemFullName.includes(lowerCaseValue);
          }
        })
        .map((item) => `${item.fullName} - ${item.phoneNumber}`);
       if (this.editCustomerDataSuggestions.length === 0) {
      this.createNewContract.get('signatoryId')?.setErrors({ notFound: true });
    } 
    } else {
      this.editDataSuggestions = [];
    }
  }

  onInputCustomerChange(event: Event) {
   const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;
  this.inputCusValue = value;
    if (value) {
      // this.inputCusValue = value
      const lowerCaseValue = value.toLowerCase();
      const isPhoneNumberSearch = !isNaN(
        Number(lowerCaseValue.replace(/\s+/g, ''))
      );

      this.editCustomerDataSuggestions = this.editCustomerData
        .filter((item) => {
          const itemPhoneNumber = item.phoneNumber.toLowerCase();
          const itemFullName = item.fullName.toLowerCase();

          if (isPhoneNumberSearch) {
            // return itemPhoneNumber.startsWith(lowerCaseValue);
            return itemPhoneNumber.includes(lowerCaseValue);
          } else {
            // return itemFullName.startsWith(lowerCaseValue);
            return itemFullName.includes(lowerCaseValue);
          }
        })
        .map((item) => `${item.fullName} - ${item.phoneNumber}`);
      if (this.editCustomerDataSuggestions.length === 0) {
      this.createNewContract.get('customerName')?.setErrors({ notFound: true });
    } 
    } else {
      this.editCustomerDataSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    const [fullName, phoneNumber] = suggestion.split(' - ');
    this.createNewContract.get('signatoryId')?.setValue(suggestion);
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

  selectCustomerSuggestion(suggestion: string) {
    const [fullName, phoneNumber] = suggestion.split(' - ');
    this.createNewContract.get('customerName')?.setValue(suggestion);
    const selectedItem = this.editCustomerData.find(
      (item) =>
        item.fullName.toLowerCase() === fullName.toLowerCase() &&
        item.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()
    );
    if (selectedItem) {
      this.customerId = selectedItem.customerId;
      this.customerName = selectedItem.fullName;
      this.cusPhoneNumber = selectedItem.phoneNumber;
      this.cusEmail = selectedItem.email;
    }
    this.editCustomerDataSuggestions = [];
    this.inputCusValue = '';
  }

  hideSuggestions() {
    this.createNewContract.get('signatoryId')?.markAsTouched();
    setTimeout(() => (this.editSuggestions = false), 200);
  }

  hideCustomerSuggestions() {
    this.createNewContract.get('customerName')?.markAsTouched();
    setTimeout(() => (this.editCustomerSuggestions = false), 200);
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

            const filesArray = this.createNewContract.get('files') as FormArray;
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

  removeFile(index: number) {
    this.forms.removeAt(index);
    this.files.splice(index, 1);
  }

  oncreateNewContract() {
    const packageN = this.createNewContract.get('packageName')?.value;
    this.matchedPackage = this.package.find(
      (pkg) => pkg.name.vi === packageN.vi || pkg.name.en === packageN.en
    );

    if (this.matchedPackage) {
      this.createNewContract.patchValue({
        packageName: {
          vi: this.matchedPackage.name.vi || '',
          en: this.matchedPackage.name.en || '',
        },
      });
    }
    if (this.createNewContract.invalid) {
      this.createNewContract.markAllAsTouched();
      // Object.keys(this.createNewContract.controls).forEach((key) => {
      //   const control = this.createNewContract.get(key);
      //   if (control && control.invalid) {
      //     console.log(`The control '${key}' is invalid`);
      //   }
      // });
    } else {
      // if (this.dialog) {
      //   this.dialogRef.close();
      // }
      this.translate
        .get('CONFIRMATION_CLCREATE.CREATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this.createANewContract();
              }
            });
        });
    }
  }

  createANewContract() {
    const contract = cloneDeep(this.createNewContract.value);
    const packageName = this.createNewContract.value.packageName;
    const service = this.packages.find(
      (item) => item.label === packageName?.vi || item.label === packageName?.en
    )?.service;
    const targetLabel = packageName?.vi || packageName?.en;
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
      }
      if (history.interestPaymentAmount) {
        history.interestPaymentAmount = parseFloat(
          history.interestPaymentAmount.replace(/\./g, '')
        );
      }
    });

    if (contract.settlementAmount) {
      contract.settlementAmount = parseFloat(
        contract.settlementAmount.replace(/\./g, '')
      );
    }
    contract.packageId = this.matchedPackage.id;
    if (contract.packageName) {
      contract.packageName = {
        vi: this.matchedPackage.name.vi,
        en: this.matchedPackage.name.en,
      };
    }

    contract.currency = this.createNewContract.get('currency')?.value;
    contract.accountId = this.customerId;
    contract.signatoryId = this.assignId;
    contract.signatoryFullName = this.assignName;

    contract.customerName = this.customerName;
    contract.phoneNumber = this.cusPhoneNumber;
    contract.signatoryPhoneNumber = this.assignPhoneNumber;
    contract.email = this.cusEmail;
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
                this.dialogRef.close();
              }
              this._alert.notify(successMessage, 'SUCCESS');
            });
          this.contractCreated.emit('success');
        } else if (data.errorCode === '100') {
          loadingRef.close();
          this._alert.notify(data.message, 'FAIL');
        } else {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_CLCREATE.CREATE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
  }
  closeCreateContract() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.packageNameSubscription) {
      this.packageNameSubscription.unsubscribe();
    }
    if (this.fromTimeSubscription) {
      this.fromTimeSubscription.unsubscribe();
    }
  }
}
