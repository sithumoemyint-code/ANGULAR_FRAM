import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
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
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { ManagementContractService } from '../../management-contract.service';
import { debounceTime } from 'rxjs';
import { AlertService } from 'src/app/modules/service/alert.service';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-edit-new-contract',
  templateUrl: './edit-new-contract.component.html',
  styleUrls: ['./edit-new-contract.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    SelectComponent, 
    InputComponent, 
    ReactiveFormsModule, 
    MatIconModule,
    TranslateModule
]
})
export class EditNewContractComponent implements OnInit {
  @Output() contractEdited = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef;
  editNewContract!: FormGroup;

  editControl = new FormControl('');
  editSuggestions: boolean = false;
  editDataSuggestions: string[] = [];
  editData: any[] = [];

  editCustomerControl = new FormControl('');
  editCustomerSuggestions: boolean = false;
  editCustomerDataSuggestions: string[] = [];
  editCustomerData: any[] = [];
  inputValue: any;
  inputCusValue: any;
  allCustomer: any[] = [];
  customerId: any;
  customerName: any;

  assignName: any;
  assignId: any;
  package: any [] = []
  packages: any [] = [];
  allAdmin: any [] = []
  files: File[] = [];
  pass: any;
  contractInfo: any = {};
  existFileArray: any[] = [];
  updatedContract: any[] = [];
  currentLang = 'vi'
assignPhoneNumber : any

  cusPhoneNumber : any
  cusEmail: any
  matchedPackage: any
status: { value: string, label: string }[] = [];
statusPeriod: { value: string, label: string }[] = [];
  
  currency = [
    { value: 'VND', label: 'VND' },
    // { value: 'USD', label: 'USD' },
  ];

  // status = [
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'ACTIVE', label: 'Active' },
  //   { value: 'CANCEL', label: 'Cancel' },
  //   { value: 'COMPLETE', label: 'Complete' },
  //   { value: 'END', label: 'End' },
  // ];

  // statusPeriod = [
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'PAID', label: 'Paid' },
  // ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditNewContractComponent>,
    private _manageContractService: ManagementContractService,
    private _alert: AlertService,
    private _uploadImage: UploadImageService,
    private languageService : LanguageService,
    private translate : TranslateService
  )
  {
    this.pass = data.dataPass
  }

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;      
    });
    this.initializeSelectStatus();
    this.period()
    
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    this.period()

    });
    const currentDate = moment().format('YYYY-MM-DDT00:00:00');

    this.editNewContract = this.fb.group({
      packageName: this.fb.group({
        vi: ['', Validators.required],
        en: ['', Validators.required],
      }),
      customerName: ['', Validators.required],
      signatoryFullName: ['', Validators.required],
      contractCode: ['', Validators.required],
      investAmount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      currency: ['', Validators.required],
      status: ['', Validators.required],
      term: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      interestPaymentPeriod: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      interestRate: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      bonusRate: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fromTime: [currentDate, Validators.required],
      toTime: [currentDate, Validators.required],

      interestPaymentHistories: this.fb.array([]),

      settlementAmount: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      gift: this.fb.group({
        vi: [''],
        en: [''],
      }),
      settlementDate: [currentDate],
      reason: [''],

      files: this.fb.array([])
    })
    this.editControl.setValue(this.editNewContract.get('signatoryFullName')?.value || '');

 this.editControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.inputValue = value || '';
      this.onInputChange(this.inputValue);
    });

    this.editNewContract
      .get('signatoryFullName')
      ?.valueChanges.subscribe((value) =>
        this.editControl.setValue(value, { emitEvent: false })
      );

    this.editCustomerControl.setValue(
      this.editNewContract.get('customerName')?.value || ''
    );

    this.editCustomerControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.inputCusValue = value || '';
        this.onInputCustomerChange(this.inputCusValue);
      });
    this.editNewContract
      .get('customerName')
      ?.valueChanges.subscribe((value) =>
        this.editCustomerControl.setValue(value, { emitEvent: false })
      );

    this.getAllPackages()
    // this.patchValuePack()
this.datePatch()
    this.fetchAllCustomerAcc()
    this.fetchAllAdminAcc()
    this.addPaymentDetail();
    this.detailContract()
  }

  get forms() {
    return this.editNewContract.get('files') as FormArray;
  }

  createPaymentDetail(): FormGroup {
    const currentDate = moment().format('YYYY-MM-DDT00:00:00');
    return this.fb.group({
      paymentPeriodTime: [currentDate],
      status: [''],
      interestPaymentAmount: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      note: [''],
    });
  }

  get paymentDetails(): FormArray {
    return this.editNewContract.get('interestPaymentHistories') as FormArray;
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
  addPaymentDetail() {
    this.paymentDetails.push(this.createPaymentDetail());
  }
 
  fetchAllAdminAcc() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._manageContractService.getAllAdminAcc().subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
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
            assignAccountId: item.accountId,
            email: item.email,
          })
        );
      }
    });
  }

  fetchAllCustomerAcc() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._manageContractService.allCustomer().subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
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
      }
    });
  }
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = inputElement.value.replace(/[^0-9]/g, '');
    this.editNewContract.get('investAmount')?.setValue(numericValue);
     
    
    inputElement.value = this.formatCurrency(numericValue);
  }

    onSettlementAmountInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const numericValue = inputElement.value.replace(/[^0-9]/g, '');
  this.editNewContract.get('settlementAmount')?.setValue(numericValue);

  inputElement.value = this.formatCurrency(numericValue);
  }
  
  onInterestPaymentInput(event: Event, index: number) {
  const inputElement = event.target as HTMLInputElement;
  const numericValue = inputElement.value.replace(/[^0-9]/g, '');
  this.paymentDetails.at(index).get('interestPaymentAmount')?.setValue(numericValue);

  inputElement.value = this.formatCurrency(numericValue);
}

  formatCurrency(value: string): string {
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('vi-VN');
  }
  detailContract() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    let id = this.pass;
    this._manageContractService
      .detailContract({ id })
      .subscribe((data: any) => {
        if (data.errorCode === '000') {
          loadingRef.close();
          this.contractInfo = data.result;

          if (this.contractInfo.fromTime) {
            this.contractInfo.fromTime = moment(
              this.contractInfo.fromTime
            ).format('YYYY-MM-DD');
          }

          if (this.contractInfo.investAmount) {
            this.contractInfo.investAmount = this.formatCurrency(this.contractInfo.investAmount);
          }

          if (this.contractInfo.toTime) {
            this.contractInfo.toTime = moment(this.contractInfo.toTime).format(
              'YYYY-MM-DD'
            );
          }
          if (this.contractInfo.settlementDate) {
            this.contractInfo.settlementDate = moment(
              this.contractInfo.settlementDate
            ).format('YYYY-MM-DD');
          }

          if(this.contractInfo.settlementAmount)
          {
           this.contractInfo.settlementAmount = this.formatCurrency(this.contractInfo.settlementAmount);
}
          if (
            this.contractInfo.interestPaymentHistories &&
            this.contractInfo.interestPaymentHistories.length > 0
          ) {
            const interestPaymentFormArray = this.editNewContract.get('interestPaymentHistories') as FormArray;
            interestPaymentFormArray.clear();
          
            this.contractInfo.interestPaymentHistories.forEach((payment: any) => {
              if (payment.paymentPeriodTime) {
                payment.paymentPeriodTime = moment(payment.paymentPeriodTime).format('YYYY-MM-DD');
              }
              if (payment.interestPaymentAmount) {
                payment.interestPaymentAmount = this.formatCurrency(payment.interestPaymentAmount);
              }
              interestPaymentFormArray.push(this.createPaymentDetail());
            });
          }
          


        if (this.contractInfo.files && this.contractInfo.files.length > 0) {
          this.contractInfo.files.forEach((file: any) => {
            const filename = file.split('/').pop();
            if (!this.files.includes(file)) {
              this.files.push(filename);
              const filesArray = this.editNewContract.get('files') as FormArray;
              filesArray.push(this.fb.control(filename));
            }
          });
        }

        if (this.contractInfo.gift) {
          this.contractInfo.gift = {
            vi: this.contractInfo.gift.vi,
            en: this.contractInfo.gift.en,
          };
        }
       
        if (this.contractInfo.customerName) {
          this.contractInfo.customerName =  `${this.contractInfo.customerName} - ${this.contractInfo.phoneNumber}`
          }
          
           if (this.contractInfo.signatoryFullName) {
          this.contractInfo.signatoryFullName =  `${this.contractInfo.signatoryFullName} - ${this.contractInfo.signatoryPhoneNumber}`
        }
        this.editNewContract.patchValue(this.contractInfo)
      }
    })
  }

  getAllPackages() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._manageContractService.allPackages().subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
        this.package = data.result;
  
        this.packages = data.result.map((item: { name: { vi: any; en: any; }; service: { vi: any; en: any; }; id: any; }) => ({
          value: this.currentLang === 'vi' ? item.name.vi : item.name.en,
          label: this.currentLang === 'vi' ? item.name.vi : item.name.en,
          service: {
            vi: item.service.vi,
            en: item.service.en,
          },
          id: item.id,
        }));
        this. patchValuePack() 
      }
    });
  }
  
patchValuePack() {
  this.editNewContract.get('packageName')?.valueChanges.subscribe(value => {
    if (value) {
   if (this.currentLang === 'en') {
        this.matchedPackage = this.package.find(pkg => pkg.name.en === value.en);
      } else if (this.currentLang === 'vi') {
        this.matchedPackage = this.package.find(pkg => pkg.name.vi === value.vi);
      }
      if (this.matchedPackage) {
        this.editNewContract.patchValue({
          term: this.matchedPackage.term || '', 
          interestPaymentPeriod: this.matchedPackage.paymentPeriod || '',
          interestRate: this.matchedPackage.interestRate || '',
          bonusRate: this.matchedPackage.bonusRate || 0
        });
      } else {
        console.warn('No matching package found for the selected value.');
      }
    }
  });
}


  datePatch() {
  this.editNewContract.get('fromTime')!.valueChanges.subscribe(value => {
    const term = this.editNewContract.get('term')?.value
    if (value && term) {
      const dateValue = new Date(value)
      dateValue.setMonth(dateValue.getMonth() + Number(term));
         const newDateValue = dateValue.toISOString().split('T')[0]; 
      this.editNewContract.patchValue({
        toTime : newDateValue
      })
    }
  });
  }
  
  onInputChange(event: Event) {
   const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;
  this.inputValue = value;
  if (value) {
    const lowerCaseValue = value.toLowerCase();
    const isPhoneNumberSearch = !isNaN(Number(lowerCaseValue.replace(/\s+/g, '')));

    this.editDataSuggestions = this.editData
      .filter(item => {
        const itemPhoneNumber = item.phoneNumber.toLowerCase();
        const itemFullName = item.fullName.toLowerCase();
        if (isPhoneNumberSearch) {
          return itemPhoneNumber.startsWith(lowerCaseValue);
        } else {
          return itemFullName.startsWith(lowerCaseValue);
        }
      })
      .map(item => `${item.fullName} - ${item.phoneNumber}`); 
 if (this.editDataSuggestions.length === 0) {
      this.editNewContract.get('signatoryFullName')?.setErrors({ notFound: true });
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
    const lowerCaseValue = value.toLowerCase();
    const isPhoneNumberSearch = !isNaN(Number(lowerCaseValue.replace(/\s+/g, '')));
    
    this.editCustomerDataSuggestions = this.editCustomerData
      .filter(item => {
        const itemPhoneNumber = item.phoneNumber.toLowerCase();
        const itemFullName = item.fullName.toLowerCase();
        
        if (isPhoneNumberSearch) {
          return itemPhoneNumber.startsWith(lowerCaseValue);
        } else {
          return itemFullName.startsWith(lowerCaseValue);
        }
      })
      .map(item => `${item.fullName} - ${item.phoneNumber}`); 
  if (this.editCustomerDataSuggestions.length === 0) {
      this.editNewContract.get('customerName')?.setErrors({ notFound: true });
    } 
  } else {
    this.editCustomerDataSuggestions = [];
  }
}

selectSuggestion(suggestion: string) {
  const [fullName, phoneNumber] = suggestion.split(' - ');
  this.editNewContract.get('signatoryFullName')?.setValue(suggestion);
  const selectedItem = this.editData.find(item => 
    item.fullName.toLowerCase() === fullName.toLowerCase() &&
    item.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()
  );
  if (selectedItem) {
    this.assignId = selectedItem.accountId;  
    this.assignName = selectedItem.fullName;  
      this.assignPhoneNumber = selectedItem.phoneNumber;

  }
  this.editDataSuggestions = [];
}

selectCustomerSuggestion(suggestion: string) {
  const [fullName, phoneNumber] = suggestion.split(' - ');
  this.editNewContract.get('customerName')?.setValue(suggestion);
  const selectedItem = this.editCustomerData.find(item =>
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
}

  hideSuggestions() {
    setTimeout(() => (this.editSuggestions = false), 200);
  }

  hideCustomerSuggestions() {
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

      this._uploadImage.uploadImage(formData).subscribe((data: any) => {
        loadingRef.close();
        if (data.errorCode === '000') {
          const imageUrl = data.result;
          
          const filesArray = this.editNewContract.get('files') as FormArray;
          filesArray.push(this.fb.control(imageUrl));
          const filename = imageUrl.split('/').pop();
          this.files.push(filename);
          // this.files.push(imageUrl);
          // this.fileUrls.push(imageUrl); 
        } else {
          this._alert.notify('Upload Fail!.', 'FAIL');
        }
      });
    }
    this.fileInput.nativeElement.value = '';
  }
  removeFile(index: number) {
    const filesArray = this.editNewContract.get('files') as FormArray;
    filesArray.removeAt(index);
    this.files.splice(index, 1);
  }

  closeEditContract() {
    this.dialogRef.close();
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

  onEditNewContract() {
 
    if (this.editNewContract.invalid) {
      this.editNewContract.markAllAsTouched();
    }
    else {
      
      this.translate.get('CONFIRMATION_CLEDIT.EDIT').subscribe((confirmationMessage: string) => {
        this._alert.confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              let updatedData = cloneDeep(this.editNewContract.value);

              const name = this.editNewContract.value.signatoryFullName;
              const [fullName, phoneNumber] = name.split(' - ');
              const lowerCaseFullName = fullName.toLowerCase();
              const res = this.editData.find((item: any) => item.fullName.toLowerCase() === lowerCaseFullName);

   
              const nameCus = this.editNewContract.value.customerName;
              const [fullCusName, cusPhoneNumber] = nameCus.split(' - ');
              const lowerCaseFullCusName = fullCusName.toLowerCase();
              const cus = this.editCustomerData.find((item: any) => item.fullName.toLowerCase() === lowerCaseFullCusName);
    
              const packageName = this.currentLang === 'en'
                ? this.editNewContract.get('packageName')?.value.en
                : this.editNewContract.get('packageName')?.value.vi;

              const foundPackage = this.package.find(pkg =>
                pkg.name.en === packageName || pkg.name.vi === packageName
              );
        
              updatedData.fromTime = moment(updatedData.fromTime).format('YYYY-MM-DDT00:00:00');
              updatedData.toTime = moment(updatedData.toTime).format('YYYY-MM-DDT00:00:00');
              updatedData.settlementDate = moment(updatedData.settlementDate).format('YYYY-MM-DDT00:00:00');
              updatedData.interestPaymentHistories.forEach((history: any) => {
                if (history.paymentPeriodTime) {
                  history.paymentPeriodTime = moment(history.paymentPeriodTime).format(
                    'YYYY-MM-DDT00:00:00'
                  );
                }
                   if (history.interestPaymentAmount) {
        history.interestPaymentAmount = parseFloat(history.interestPaymentAmount.replace(/\./g, ''));
      }
              });
              updatedData.id = this.pass
              updatedData.accountId = cus?.customerId,
                updatedData.currency =this.editNewContract.get('currency')?.value; 'VND';
              updatedData.signatoryId = res?.assignAccountId
              updatedData.signatoryFullName = res?.fullName;
              updatedData.customerName = cus?.fullName;
              updatedData.phoneNumber = cus?.phoneNumber;
              updatedData.email = cus?.email;
              updatedData.signatoryPhoneNumber = this.assignPhoneNumber

              if (updatedData.settlementAmount) {
                 updatedData.settlementAmount = parseFloat(updatedData.settlementAmount.replace(/\./g, ''));
              }
              if (foundPackage) {
                updatedData.service = {
                  vi: foundPackage.service.vi,
                  en: foundPackage.service.en
                };
              }
        
              if (foundPackage) {
                updatedData.packageId = foundPackage.id;
              }

              if (foundPackage) {
                updatedData.packageName = {
                  vi: foundPackage.name.vi,
                  en: foundPackage.name.en
                };
              }
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true
              })
    
              this._manageContractService.updateContract(updatedData).subscribe((data: any) => {
                if (data.errorCode === '000') {
                  loadingRef.close()
                  this.updatedContract = data.result
                  this.translate.get('NOTIFICATION_CLEDIT.EDIT_SUCCESS').subscribe((successMessage: string) => {
                    this._alert.notify(successMessage, 'SUCCESS');
                    if (this.dialog) {
                        this.dialogRef.close();
                     }
                  })
                  this.contractEdited.emit('success')
                }
                else {
                  loadingRef.close()
                  this.translate.get('NOTIFICATION_CLEDIT.EDIT_FAIL').subscribe((failMessage: string) => {
                    this._alert.notify(failMessage, 'FAIL');
                  });
                }
              }
              )
            }
          });
      })
    }
  }
}
