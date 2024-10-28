import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonNotiService } from './common-noti.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TextAreaComponent } from 'src/app/modules/custom/text-area/text-area.component';

@Component({
  selector: 'app-common-notification',
  templateUrl: './common-notification.component.html',
  styleUrls: ['./common-notification.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginatorComponent,
    InputComponent,
    SelectComponent,
    MatProgressSpinnerModule,
    PermissionDirective,
    TranslateModule,
    TextAreaComponent,
  ],
})
export class CommonNotificationComponent implements OnInit {
  editForm!: FormGroup;
  type: any;
  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  templateData: any[] = [];
  detail: any;
  edit: any;
  _id: any;
  isAdd: boolean = false;
  isButton: boolean = true;
  _status: any;
  _selectedLanguage: any = 'en';
  _selectedSecondColumnLanguage: any = 'en';
  secondColumnLanguages: any = [];
  selectLang = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Vietnamese' },
  ];
  currentLang = 'vi';

  @ViewChild('editModal') editModal!: TemplateRef<any>;
  @ViewChild('detailModal') detailModal!: TemplateRef<any>;
  private modal!: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private _common: CommonNotiService,
    private _alert: AlertService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      messageKey: ['', Validators.required],
      language: ['vi'],
      titleEn: [''],
      titleVi: [''],
      contentEn: ['', Validators.required],
      contentVi: ['', Validators.required],
      secondLanguage: ['en'],
    });
    this.getTemplate();

    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  onChangeStatus(element: any) {
    this._id = element.messageKey;
    this._status = element.isActive;
    this.translate
      .get('CONFIRM_SWITCH_COMMOM.CONFIRM')
      .subscribe((message: string) => {
        this._alert.confirm(message).subscribe((result: boolean) => {
          if (result) {
            this._confirmChangeStatus();
          }
        });
      });
  }

  _confirmChangeStatus() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._status = this._status === true ? false : true;

    let body = {
      id: this._id,
      isActive: this._status,
    };

    this._common.changeStatus(body).subscribe((data: any) => {
      loadingRef.close();
      this.getTemplate();
    });
  }

  getTemplate(offset: number = 0) {
    let page = (this.offset = offset);
    let size = this.size;

    let params = {
      page,
      size,
    };

    this._common.getTemplate(params).subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.templateData = data.result.content;
        this.totalOffset = data.totalPages - 1;
      }
    });
  }

  addAnother() {
    this.isAdd = true;
    this.isButton = false;
  }

  onEdit(data: any) {
    this.edit = data;
    this.modal = this.dialog.open(this.editModal, {
      width: '50%',
      height: '90%',
      disableClose: true,
    });

    this.editForm.setValue({
      messageKey: data.messageType.name || '',
      language: 'en',
      titleEn: data.title.en,
      titleVi: data.title.vi,
      contentEn: data.content.en || '',
      contentVi: data.content.vi || '',
      secondLanguage: 'en',
    });
  }

  onCallEdit() {
    this.translate
      .get('NOTIFICATION_COMMON.CONFIRM')
      .subscribe((message: string) => {
        this._alert.confirm(message).subscribe((result) => {
          this.modal.close();
          let body = {
            messageKey: this.edit.messageKey,
            title: {
              en: this.editForm.get('titleEn')?.value,
              vi: this.editForm.get('titleVi')?.value,
            },
            content: {
              en: this.editForm.get('contentEn')?.value,
              vi: this.editForm.get('contentVi')?.value,
            },
          };

          const loadingRef = this.dialog.open(ApiLoadingComponent, {
            disableClose: true,
          });

          this._common.updateTemplate(body).subscribe((data: any) => {
            if (data.errorCode === '000') {
              loadingRef.close();
              this.translate
                .get('NOTIFICATION_COMMON.SUCCESS')
                .subscribe((message: string) => {
                  this._alert.notify(message, 'SUCCESS');
                  this.getTemplate();
                });
            } else {
              this.translate
                .get('NOTIFICATION_COMMON.FAIL')
                .subscribe((message: string) => {
                  loadingRef.close();
                  this._alert.notify(message, 'FAIL');
                });
            }
          });
        });
      });
  }

  changeLanguage() {
    this._selectedLanguage = this.editForm.get('language')?.value;
    const secondLanguageValue = this._selectedLanguage === 'en' ? 'vi' : 'en';
    const secondLanguageLabel =
      this._selectedLanguage === 'en' ? 'Vietnamese' : 'English';
    this.editForm.controls?.['secondLanguage'].setValue(secondLanguageValue);
    this._selectedSecondColumnLanguage = secondLanguageValue;
    this.secondColumnLanguages = [
      { value: secondLanguageValue, label: secondLanguageLabel },
    ];
  }

  onDetail(element: any) {
    this.modal = this.dialog.open(this.detailModal, {
      width: '60%',
      height: '65%',
      disableClose: true,
    });

    this.detail = element;
  }

  close() {
    this.modal.close();
    this.isAdd = false;
    this.isButton = true;
  }
}
