import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { RichTextStandaloneComponent } from 'src/app/modules/custom/rich-text-standalone/rich-text-standalone.component';
import { PackageService } from './package.service';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import * as moment from 'moment';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { TextAreaComponent } from 'src/app/modules/custom/text-area/text-area.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import { cloneDeep } from 'lodash';
import { PermissionDirective } from '../permission.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-management-package',
  templateUrl: './management-package.component.html',
  styleUrls: ['./management-package.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PaginatorComponent,
    CommonModule,
    InputComponent,
    SelectComponent,
    MatDialogModule,
    RichTextStandaloneComponent,
    TextAreaComponent,
    TranslateModule,
    PermissionDirective,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ManagementPackageComponent implements OnInit {
  languages = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Vietnamese' },
  ];
  currentLang = 'vi';

  secondColumnLanguages: any = [
    // { value: 'en', label: 'English' },
    // { value: 'vi', label: 'Vietnamese' },
  ];

  secondColumnLanguagesVi: any = [];
  secondColumnLanguagesEn: any = [];

  terms = [
    { value: '6', label: '6' },
    { value: '12', label: '12' },
  ];
  @ViewChild('createPackageModal') createPackageModal!: TemplateRef<any>;
  @ViewChild('detailPackageModal') detailPackageModal!: TemplateRef<any>;

  private modal!: MatDialogRef<any>;
  searchForm!: FormGroup;
  createForm!: FormGroup;
  _status: any;
  _id: any;

  page: number = 0;
  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;

  isLoading: boolean = false;

  _selectedLanguage: any = 'en';
  _selectedSecondColumnLanguage: any = 'en';

  isChecked: boolean = false;
  isAdded: boolean = false;

  packages: any[] = [];
  detailPackage: any;

  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = '';
  _imgUrl: any;

  isEdit: boolean = false;
  bothLanguage: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _alert: AlertService,
    private _package: PackageService,
    private _uploadImage: UploadImageService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    this.searchForm = this.fb.group({
      packageName: [''],
    });

    this.createForm = this.fb.group({
      term: ['', [Validators.required]],
      paymentPeriod: ['', [Validators.required]],
      interestRate: ['', [Validators.required]],
      bonusRate: [''],
      language: ['vi', [Validators.required]],
      secondLanguage: ['en', [Validators.required]],
      nameVi: [''],
      nameEn: [''],
      descriptionEn: [''],
      descriptionVi: [''],
      serviceVi: [''],
      serviceEn: [''],
      giftVi: [''],
      giftEn: [''],
      fromTime: ['', [Validators.required]],
      toTime: ['', [Validators.required]],
    });
    this.changeLanguage();
    this.search();
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  addColumn() {
    this.isAdded = true;

    // Make all Vietnamese fields required
    this.createForm.controls['nameVi'].setValidators([Validators.required]);
    this.createForm.controls['descriptionVi'].setValidators([
      Validators.required,
    ]);
    this.createForm.controls['serviceVi'].setValidators([Validators.required]);
    this.createForm.controls['giftVi'].setValidators([Validators.required]);

    // Make all English fields required
    this.createForm.controls['nameEn'].setValidators([Validators.required]);
    this.createForm.controls['descriptionEn'].setValidators([
      Validators.required,
    ]);
    this.createForm.controls['serviceEn'].setValidators([Validators.required]);
    this.createForm.controls['giftEn'].setValidators([Validators.required]);

    this.updateFormValidation();
    // this.changeLanguage();
  }

  changeLanguage() {
    this._selectedLanguage = this.createForm.get('language')?.value;

    const secondLanguageValue = this._selectedLanguage === 'en' ? 'vi' : 'en';
    const secondLanguageLabel =
      this._selectedLanguage === 'en' ? 'Vietnamese' : 'English';
    // Reset and set the second language control
    this.createForm.controls?.['secondLanguage'].setValue(secondLanguageValue);
    this._selectedSecondColumnLanguage = secondLanguageValue;
    // Update the second column language options
    this.secondColumnLanguages = [
      { value: secondLanguageValue, label: secondLanguageLabel },
    ];

    if (this._selectedLanguage === 'vi') this.setValidatorsForVi();
    else if (this._selectedLanguage === 'en') this.setValidatorsForEn();
  }

  setValidatorsForVi() {
    this.createForm.controls['nameVi'].setValidators([Validators.required]);
    this.createForm.controls['descriptionVi'].setValidators([
      Validators.required,
    ]);
    this.createForm.controls['serviceVi'].setValidators([Validators.required]);
    this.createForm.controls['giftVi'].setValidators([Validators.required]);

    // this.createForm.controls['nameEn'].clearValidators();
    // this.createForm.controls['descriptionEn'].clearValidators();
    // this.createForm.controls['serviceEn'].clearValidators();
    // this.createForm.controls['giftEn'].clearValidators();

    this.createForm.controls['nameEn'].clearValidators();
    this.createForm.controls['nameEn'].setValue('');
    this.createForm.controls['descriptionEn'].clearValidators();
    this.createForm.controls['descriptionEn'].setValue('');
    this.createForm.controls['serviceEn'].clearValidators();
    this.createForm.controls['serviceEn'].setValue('');
    this.createForm.controls['giftEn'].clearValidators();
    this.createForm.controls['giftEn'].setValue('');

    // this.updateFormValidation();
  }
  updateFormValidation() {
    this.createForm.controls['nameVi'].updateValueAndValidity();
    this.createForm.controls['descriptionVi'].updateValueAndValidity();
    this.createForm.controls['serviceVi'].updateValueAndValidity();
    this.createForm.controls['giftVi'].updateValueAndValidity();

    this.createForm.controls['nameEn'].updateValueAndValidity();
    this.createForm.controls['descriptionEn'].updateValueAndValidity();
    this.createForm.controls['serviceEn'].updateValueAndValidity();
    this.createForm.controls['giftEn'].updateValueAndValidity();
  }

  setValidatorsForEn() {
    this.createForm.controls['nameEn'].setValidators([Validators.required]);
    this.createForm.controls['descriptionEn'].setValidators([
      Validators.required,
    ]);
    this.createForm.controls['serviceEn'].setValidators([Validators.required]);
    this.createForm.controls['giftEn'].setValidators([Validators.required]);

    // this.createForm.controls['nameVi'].clearValidators();
    // this.createForm.controls['descriptionVi'].clearValidators();
    // this.createForm.controls['serviceVi'].clearValidators();
    // this.createForm.controls['giftVi'].clearValidators();

    this.createForm.controls['nameVi'].clearValidators();
    this.createForm.controls['nameVi'].setValue('');
    this.createForm.controls['descriptionVi'].clearValidators();
    this.createForm.controls['descriptionVi'].setValue('');
    this.createForm.controls['serviceVi'].clearValidators();
    this.createForm.controls['serviceVi'].setValue('');
    this.createForm.controls['giftVi'].clearValidators();
    this.createForm.controls['giftVi'].setValue('');

    // this.createForm.controls['nameVi'].updateValueAndValidity();
    // this.createForm.controls['descriptionVi'].updateValueAndValidity();
    // this.createForm.controls['serviceVi'].updateValueAndValidity();
    // this.createForm.controls['giftVi'].updateValueAndValidity();

    // this.updateFormValidation();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('type', 'BANNER');

      this._uploadImage.uploadImage(formData).subscribe((data: any) => {
        this._imgUrl = data.result;
      });
    }
  }

  search(offset = 0) {
    this.isLoading = false;
    this.packages = [];

    let search = cloneDeep(this.searchForm.value);
    search.page = this.offset = offset;
    search.size = this.size;

    this._package.searchPackages(search).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this.isLoading = false;

          this.packages = response.result.content;
          this.totalOffset = response.result.totalPages - 1;
        } else {
          this.isLoading = false;
          this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                this._alert.notify(failMessage, 'FAIL');
              });
        }
      },
      error: (error: any) => {
        this.isLoading = false;
       this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                this._alert.notify(failMessage, 'FAIL');
              });
      },
    });

    // .subscribe((data: any) => {
    //   this.packages = data.result.content;
    //   this.totalOffset = data.result.totalPages - 1;
    // });
  }

  onToggle() {
    console.log(this.isChecked); // Logs the current state of the checkbox
  }

  openEditPackageModal(element: any) {
    this.imageUrl = '';
    this.isEdit = true;
    this._id = element.id;

    if (element.description.vi !== '' && element.description.en !== '') {
      this.secondColumnLanguagesVi = [
        { value: 'Vietnamese', label: 'Vietnamese' },
      ];
      this.createForm.get('language')?.setValue('Vietnamese');
      this.secondColumnLanguagesEn = [{ value: 'English', label: 'English' }];
      this.createForm.get('secondLanguage')?.setValue('English');

      this.bothLanguage = true;
      this.addColumn();
    } else {
      if (element.description.en !== '') {
        this.isAdded = false;
        this._selectedLanguage = 'en';
        this.createForm.get('language')?.setValue('en');

        this.changeLanguage();
      } else if (element.description.vi !== '') {
        this.isAdded = false;
        this._selectedLanguage = 'vi';
        this.createForm.get('language')?.setValue('vi');

        this.changeLanguage();
      }
    }

    if (element.description)
      this.createForm.patchValue({
        term: element?.term || '',
        paymentPeriod: element.paymentPeriod || '',
        interestRate: element?.interestRate || '',
        bonusRate: element?.bonusRate || '',
        // // language: 'en',
        // // secondLanguage: 'vi',
        nameVi: element?.name?.vi || '',
        nameEn: element?.name?.en || '',
        descriptionEn: element?.description?.en || '',
        descriptionVi: element?.description?.vi || '',
        serviceVi: element?.service?.vi || '',
        serviceEn: element?.service?.en || '',
        giftVi: element?.gift?.vi || '',
        giftEn: element?.gift?.en || '',
        fromTime: element?.fromTime || '',
        toTime: element?.toTime || '',
      });
    this.imageUrl = element?.imageUrl?.en;

    this.modal = this.dialog.open(this.createPackageModal, {
      height: '90%',
      width: '60%',
      disableClose: true,
    });
  }

  confirmUpdate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
    } else {
      this.translate
        .get('CONFIRMATION_PUPDATE.UPDATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              let body = {
                id: this._id,
                term: this.createForm.get('term')?.value,
                paymentPeriod: this.createForm.get('paymentPeriod')?.value,
                interestRate: this.createForm.get('interestRate')?.value,
                bonusRate: this.createForm.get('bonusRate')?.value,
                imageUrl: {
                  vi: this._imgUrl ?? this.imageUrl,
                  en: this._imgUrl ?? this.imageUrl,
                },
                name: {
                  vi: this.createForm.get('nameVi')?.value,
                  en: this.createForm.get('nameEn')?.value,
                },
                service: {
                  vi: this.createForm.get('serviceVi')?.value,
                  en: this.createForm.get('serviceEn')?.value,
                },
                description: {
                  vi: this.createForm.get('descriptionVi')?.value,
                  en: this.createForm.get('descriptionEn')?.value,
                },
                gift: {
                  vi: this.createForm.get('giftVi')?.value,
                  en: this.createForm.get('giftEn')?.value,
                },
                fromTime: moment(this.createForm.get('fromTime')?.value).format(
                  'YYYY-MM-DDT00:00:00'
                ),
                toTime: moment(this.createForm.get('toTime')?.value).format(
                  'YYYY-MM-DDT23:59:59'
                ),
              };

              this._package.updatePackage(body).subscribe((data: any) => {
                if (data.errorCode === '000') {
                  this.translate
                    .get('NOTIFICATION_PUPDATE.UPDATE_SUCCESS')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(successMessage, 'SUCCESS');
                    });
                  this.close();
                  this.search();
                } else {
                  this.close();
                  this.translate
                    .get('NOTIFICATION_PUPDATE.UPDATE_FAIL')
                    .subscribe((failMessage: string) => {
                      this._alert.notify(failMessage, 'FAIL');
                    });
                }
              });
            });
        });
    }
  }
  openCreatePackageModal() {
    this.imageUrl = '';
    this.isEdit = false;
    this.isAdded = false;
    this.changeLanguage();
    this.modal = this.dialog.open(this.createPackageModal, {
      height: '90%',
      width: '60%',
      disableClose: true,
    });
  }

  confirmCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
    } else {
     
      this.translate
        .get('CONFIRMATION_PCREATE.CREATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                let body = {
                  term: this.createForm.get('term')?.value,
                  paymentPeriod: this.createForm.get('paymentPeriod')?.value,
                  interestRate: this.createForm.get('interestRate')?.value,
                  bonusRate: this.createForm.get('bonusRate')?.value,
                  imageUrl: {
                    vi: this._imgUrl,
                    en: this._imgUrl,
                  },
                  name: {
                    vi: this.createForm.get('nameVi')?.value,
                    en: this.createForm.get('nameEn')?.value,
                  },
                  service: {
                    vi: this.createForm.get('serviceVi')?.value,
                    en: this.createForm.get('serviceEn')?.value,
                  },
                  gift: {
                    vi: this.createForm.get('giftVi')?.value,
                    en: this.createForm.get('giftEn')?.value,
                  },
                  description: {
                    vi: this.createForm.get('descriptionVi')?.value,
                    en: this.createForm.get('descriptionEn')?.value,
                  },
                  // fromTime: this.createForm.get('fromTime')?.value,
                  // toTime: this.createForm.get('toTime')?.value,
                  fromTime:  moment(this.createForm.get('fromTime')?.value).format('YYYY-MM-DDT00:00:00'),
 toTime:moment(this.createForm.get('toTime')?.value).format('YYYY-MM-DDT23:59:59')
                };

                this._package.createPackage(body).subscribe((data: any) => {
                  if (data.errorCode === '000') {
                    this.translate
                      .get('NOTIFICATION_PCREATE.CREATE_SUCCESS')
                      .subscribe((successMessage: string) => {
                         if (this.modal) {
        this.modal.close();
      }
                        this._alert.notify(successMessage, 'SUCCESS');
                      });
                    this.close();
                    this.search();
                  } else {
                    this.close();
                    this.translate
                      .get('NOTIFICATION_PCREATE.CREATE_FAIL')
                      .subscribe((failMessage: string) => {
                        this._alert.notify(failMessage, 'FAIL');
                      });
                  }
                });
              }
            });
        });
    }
  }

  openDetailPackageModal(element: any) {
    this.modal = this.dialog.open(this.detailPackageModal, {
      height: '90%',
      width: '60%',
    });

    this._package
      .getDetailPackage({ id: element.id })
      .subscribe((data: any) => {
        this.detailPackage = data.result;
      });
  }

  close() {
    this.createForm.reset({
      term: '',
      paymentPeriod: '',
      interestRate: '',
      bonusRate: '',
      language: 'vi', // Reset to default language
      secondLanguage: 'en', // Reset to default second language
      nameVi: '',
      nameEn: '',
      descriptionEn: '',
      descriptionVi: '',
      serviceVi: '',
      serviceEn: '',
      giftVi: '',
      giftEn: '',
      fromTime: '',
      toTime: '',
    });
    this._selectedLanguage = 'vi';
    this.modal.close();
    this.isAdded = false;
    this.bothLanguage = false;
  }

  deletePackage(element: any) {
    this._status = 'DELETE';
    this._id = element.id;
    this.translate
      .get('CONFIRMATION_PDELTE.DELETE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              this._confirmDeletePackage();
            }
          });
      });
  }

  _confirmDeletePackage() {
    let body = {
      id: this._id,
      status: this._status,
    };
    this._package.changePackageStatus(body).subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.translate
          .get('NOTIFICATION_PDELETE.DELETE_SUCCESS')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'SUCCESS');
          });
        this.search();
      } else {
        this.translate
          .get('NOTIFICATION_PDELETE.DELETE_FAIL')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      }
    });
  }

  onChangeStatus(element: any) {
    this._status = element.status;
    this._id = element.id;
    this.translate
      .get('CONFIRMATION_PSTATUS.STATUS')
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

  _confirmChangeStatus() {
    this._status = this._status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    let body = {
      id: this._id,
      status: this._status,
    };

    this._package.changePackageStatus(body).subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.translate
          .get('NOTIFICATION_PSTATUS.STATUS_SUCCESS')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'SUCCESS');
          });
        this.search();
      } else {
        this.translate
          .get('NOTIFICATION_PSTATUS.STATUS_FAIL')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      }
    });
  }
}
