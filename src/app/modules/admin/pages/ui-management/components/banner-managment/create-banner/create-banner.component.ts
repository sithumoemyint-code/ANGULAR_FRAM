import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { BannerService } from '../banner.service';
import { cloneDeep } from 'lodash';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import * as moment from 'moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    InputComponent,
    SelectComponent,
    TranslateModule,
  ],
})
export class CreateBannerComponent implements OnInit {
  selectStatus = [
    { value: 'NONE', label: 'NONE' },
    { value: 'DEEP_LINK', label: 'DeepLink' },
    { value: 'URL', label: 'URL' },
  ];
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = '';
  createForm!: FormGroup;
  _imgUrl: any;
  options: any[] = [];
  filteredOptions: any[] = [];
  showOptions = false;
  vl: any = 'NONE';
  currentLang = 'vi';

  @ViewChild('confirmCreateModal') confirmCreateModal!: TemplateRef<any>;
  @ViewChild('confirmEditModal') confirmEditModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('successCreateModal') successCreateModal!: TemplateRef<any>;
  private _modal!: MatDialogRef<any>;

  data: any;
  isEdit: boolean = false;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private _banner: BannerService,
    private _uploadImage: UploadImageService,
    private _alert: AlertService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    this.data = history.state.data;
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      fromTime: ['', [Validators.required]],
      toTime: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      routeType: ['NONE'],
      routeTo: ['', [Validators.required]],
      imageUrl: [null, Validators.required],
    });

    if (this.data) {
      this.isEdit = true;

      this.createForm.setValue({
        title: this.data.element.title,
        fromTime: this.data.element.fromTime.split(' ')[0],
        toTime: this.data.element.toTime.split(' ')[0],
        priority: this.data.element.priority || '',
        routeType: this.data.element.routeType || '',
        routeTo: this.data.element.routeTo || '',
        imageUrl: this.data.element.imageUrl,
      });
      this.vl = this.data.element.routeType;
      this.imageUrl = this.data.element.imageUrl;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

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

  onCreateBanner() {
    if (this.vl === 'NONE') {
      this.createForm.patchValue({
        routeType: 'NONE',
      });

      this.createForm.get('routeTo')?.clearValidators();
      this.createForm.get('routeTo')?.updateValueAndValidity();
    } else {
      this.createForm.get('routeTo')?.setValidators([Validators.required]);
      this.createForm.get('routeTo')?.updateValueAndValidity();
    }
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      // Object.keys(this.createForm.controls).forEach((key) => {
      //   const control = this.createForm.get(key);
      //   if (control?.invalid) {
      //     console.log(`${key} is invalid`);
      //   }
      // });
    } else {
      this.translate
        .get('CONFIRMATION_BCREATE.CREATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this._confirmCreateBanner();
              }
            });
        });
    }
  }

  _confirmCreateBanner() {
    let create = cloneDeep(this.createForm.value);

    create.fromTime = moment(create.fromTime).format('YYYY-MM-DDT00:00:00');
    create.toTime = moment(create.toTime).format('YYYY-MM-DDT23:59:59');
    create.imgUrl = this._imgUrl || this.imageUrl;

 if (moment(create.fromTime).isBefore(create.toTime)) {
      this._banner.createBanner(create).subscribe((data: any) => {
        if (data.errorCode === '000') {
          this.translate
            .get('NOTIFICATION_BCREATE.CREATE_SUCCESS')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'SUCCESS');
              this.routeToBack();
            });
        }
        else {
          this.translate
            .get('NOTIFICATION_BCREATE.CREATE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
    } else {
      this.translate
        .get('NOTIFICATION_BCREATE.TIME_INVALID')
        .subscribe((invalidTimeMessage: string) => {
          this._alert.notify(invalidTimeMessage, 'FAIL');
        });
    }
  }

  onUpdateBanner() {
      if (this.vl === 'NONE') {
      this.createForm.patchValue({
        routeType: 'NONE',
      });

      this.createForm.get('routeTo')?.clearValidators();
      this.createForm.get('routeTo')?.updateValueAndValidity();
    } else {
      this.createForm.get('routeTo')?.setValidators([Validators.required]);
      this.createForm.get('routeTo')?.updateValueAndValidity();
    }
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
    } else {
      this.translate
        .get('CONFIRMATION_BUPDATE.UPDATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this._confirmUpdateBanner();
              }
            });
        });
    }
  }

  _confirmUpdateBanner() {
    let create = cloneDeep(this.createForm.value);
      create.fromTime = moment(create.fromTime).format('YYYY-MM-DDT00:00:00');
      create.toTime = moment(create.toTime).format('YYYY-MM-DDT23:59:59');
      create.id = this.data.element.id;
      create.imgUrl = this._imgUrl;
      if (!this._imgUrl) {
        create.imgUrl = this.imageUrl;
    }
    if (moment(create.fromTime).isBefore(create.toTime)) {
    
      this._banner.updateBanner(create).subscribe((data: any) => {
        if (data.errorCode === '000') {
          this.translate
            .get('NOTIFICATION_BUPDATE.UPDATE_SUCCESS')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'SUCCESS');
            });
          this.routeToBack();
        } else {
          this.translate
            .get('NOTIFICATION_BUPDATE.UPDATE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
    } else {
      this.translate
        .get('NOTIFICATION_BCREATE.TIME_INVALID')
        .subscribe((invalidTimeMessage: string) => {
          this._alert.notify(invalidTimeMessage, 'FAIL');
        });
    }
  }

  routeToBack() {
    this.router.navigate(['/admin/ui-management/banner-managment']);
  }

  changeRouteType() {
    this.vl = this.createForm.get('routeType')?.value;

   
    // if (this.isEdit && this.data.element.routeTo !== 'URL') {
    //   this.createForm.get('routeTo')?.setValue('')
    //   if (this.vl === 'URL') {
    //     this.createForm.get('routeTo')?.setValue(this.data.element.routeTo);
    //   }
    // }
 
if (this.isEdit) {
 
  if (this.vl !== 'URL') {
    this.createForm.get('routeTo')?.setValue('');
  }
   if (this.vl !== 'DEEP_LINK') {
    this.createForm.get('routeTo')?.setValue('');
  }
}

    // not edit
    if (this.vl === 'DEEP_LINK') {
      this._banner.deepLink().subscribe((data: any) => {
        if (data.errorCode === '000') {
          this.options = data.result;
        }
      });
    }
    else {
      this.vl = this.createForm.get('routeType')?.value;
    }
  }

  onInputClick() {
    this.filteredOptions = this.options;
  }

  onInput() {
    const query = this.createForm.get('routeTo')?.value;
    this.filteredOptions = this.options.filter((option) =>
      option.deeplink.includes(query)
    );
  }

  selectOption(option: { deeplink: any }) {
    this.createForm.get('routeTo')?.setValue(option.deeplink);
    this.filteredOptions = [];
  }
}
