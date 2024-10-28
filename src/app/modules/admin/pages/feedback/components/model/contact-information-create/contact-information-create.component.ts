import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminImgUploadComponent } from 'src/app/modules/custom/admin-img-upload/admin-img-upload.component';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { ConfirmComponent } from 'src/app/modules/custom/model/confirm/confirm.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ContactInformationService } from '../../contact-information/contact-information.service';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

type BtnType = string;
type headerType = string;
@Component({
  selector: 'app-contact-information-create',
  templateUrl: './contact-information-create.component.html',
  styleUrls: ['./contact-information-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    InputComponent,
    AdminImgUploadComponent,
    ConfirmComponent,
    TranslateModule,
  ],
})
export class ContactInformationCreateComponent implements OnInit {
  createForm!: FormGroup;
  imageRequire: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  loading: boolean = false;
  btnText: BtnType = '';
  headerTitle: headerType = '';
  @Output() contactInformationCreated = new EventEmitter<string>();

  constructor(
    private dialogRef: MatDialogRef<ContactInformationCreateComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _alert: AlertService,
    private _contactInformationService: ContactInformationService,
    private _uploadImage: UploadImageService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate
      .get(['CREATE_NEW_ICON', 'CREATE'])
      .subscribe((translations: any) => {
        this.headerTitle = translations['CREATE_NEW_ICON'];
        this.btnText = translations['CREATE'];
      });

    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      route: ['', [Validators.required]],
      iconUrl: ['', [Validators.required]],
    });

    if (this.data !== null) {
      this.btnText = 'Update';
      this.headerTitle = 'Edit Icon';
      this.refillData();
    }
  }

  refillData() {
    this.createForm.patchValue({
      name: this.data.refill.name,
      route: this.data.refill.route,
      iconUrl:
        'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg',
    });
  }

  onImageSelected(file: any) {
    this.imageRequire = false;
  }

  closeCreate() {
    this.dialogRef.close();
    this.selectedImage = null;
    const fileInput = document.getElementById('iconUrl') as HTMLInputElement;
    fileInput.value = '';
    this.createForm.reset();
  }

  create() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.imageRequire = true;
    } else {
      forkJoin({
        firstMessage: this.translate.get('COMMONE.ARE_YOU'),
        create: this.translate.get('COMMONE.CREATE'),
        edit: this.translate.get('COMMONE.EDIT'),
        lastMessage: this.translate.get('COMMONE.ADMINISTRATOR.THIS_CONTACT'),
      }).subscribe(({ firstMessage, create, edit, lastMessage }) => {
        this._alert
          .confirm(
            `${firstMessage} ${
              this.data !== null ? edit : create
            } ${lastMessage}`
          )
          .subscribe((result: boolean) => {
            if (result) {
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true,
              });
              const formData = new FormData();

              const file = this.createForm.value.iconUrl;
              formData.append('file', file);
              formData.append('filename', file.name);

              formData.append('type', 'BANNER');

              this._uploadImage.uploadImage(formData).subscribe({
                next: (response: any) => {
                  if (response.errorCode === '000') {
                    const imageResult = response.result;

                    this.createForm.patchValue({
                      iconUrl: imageResult,
                    });

                    this._contactInformationService
                      .crateContact(this.createForm.value)
                      .subscribe({
                        next: (response: any) => {
                          if (response.errorCode === '000') {
                            loadingRef.close();
                            forkJoin({
                              firstMessage: this.translate.get(
                                'COMMONE.CREATED_CONTACT'
                              ),
                              create: this.translate.get('COMMONE.CREATE'),
                              edit: this.translate.get('COMMONE.EDIT'),
                              lastMessage: this.translate.get(
                                'COMMONE.SUCCESSFULLY'
                              ),
                            }).subscribe(
                              ({ firstMessage, create, edit, lastMessage }) => {
                                this._alert.notify(
                                  `${firstMessage} ${
                                    this.data !== null ? edit : create
                                  } ${lastMessage}`,
                                  'SUCCESS'
                                );
                              }
                            );

                            this.dialogRef.close();
                            this.contactInformationCreated.emit('success');
                          } else {
                            loadingRef.close();
                            this._alert.notify(response.message, 'FAIL');
                          }
                        },
                        error: (error: any) => {
                          loadingRef.close();
                          this.translate
                            .get('COMMONE.SOMETHING_WRONG')
                            .subscribe((successMessage: string) => {
                              this._alert.notify(successMessage, 'FAIL');
                            });
                        },
                      });
                  } else {
                    loadingRef.close();
                    this.translate
                      .get('COMMONE.UPDATE_IMAGE_FAIL')
                      .subscribe((successMessage: string) => {
                        this._alert.notify(successMessage, 'FAIL');
                      });
                  }
                },
                error: (error: any) => {
                  loadingRef.close();
                  this.translate
                    .get('COMMONE.UPDATE_IMAGE_FAIL')
                    .subscribe((successMessage: string) => {
                      this._alert.notify(successMessage, 'FAIL');
                    });
                },
              });
            }
          });
      });
    }
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }
}
