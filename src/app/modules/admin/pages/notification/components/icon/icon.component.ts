import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IconService } from './icon.service';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { cloneDeep } from 'lodash';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PermissionDirective,
    TranslateModule,
  ],
})
export class IconComponent implements OnInit {
  @ViewChild('editModal') editModal!: TemplateRef<any>;

  selectedFile: File | null = null;

  updateIcon: any;

  imageUrl: string | ArrayBuffer | null = '';

  _imgUrl: any;

  icon: any[] = [];

  createForm!: FormGroup;

  _createForm!: MatDialogRef<any>;

  messageType: any;
  currentLang = 'vi';

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _icon: IconService,
    private _uploadImage: UploadImageService,
    private _alert: AlertService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.getIcon();

    this.createForm = this.fb.group({
      iconId: [''],
      name: ['', [Validators.required]],
      messageType: ['', [Validators.required]],
    });

    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  openEdit(item: any) {
    this.getMessageType();
    this.createForm.setValue({
      iconId: item.id,
      name: item.messageType.name,
      messageType: item.messageType.type,
    });
    this.imageUrl = item.imgUrl;

    this._createForm = this.dialog.open(this.editModal, {
      width: '35%',
      disableClose: true,
    });
  }

  getIcon() {
    this._icon.getIcon().subscribe((data: any) => {
      this.icon = data.result;
    });
  }

  getMessageType() {
    this._icon.getMessageType().subscribe((res: any) => {
      this.messageType = res.result;
    });
  }

  create() {
    this.translate
      .get('CONFIRMATION_ICON.UPDATE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              this._createForm.close();
              this.editIcon();
            }
          });
      });
  }

  editIcon() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    let form = cloneDeep(this.createForm.value);
    if (this._imgUrl === undefined) {
      form.iconUrl = this.imageUrl;
    } else {
      form.iconUrl = this._imgUrl;
    }

    this._icon.updateIcon(form).subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_ICON.UPDATE_SUCCESS')
          .subscribe((message: string) => {
            this._alert.notify(message, 'SUCCESS');
            this.getIcon();
          });
      } else {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_ICON.UPDATE_FAIL')
          .subscribe((message: string) => {
            this._alert.notify(message, 'FAIL');
            this.getIcon();
          });
      }
    });
  }

  closeCreate() {
    this._createForm.close();
    this.imageUrl = null;
    this.createForm.reset();
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
}
