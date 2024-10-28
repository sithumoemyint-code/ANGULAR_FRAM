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
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '../../../../../custom/select/select.component';
import { RichTextStandaloneComponent } from '../../../../../custom/rich-text-standalone/rich-text-standalone.component';
import { CommonModule } from '@angular/common';
import { ManagementNewsService } from '../../management-news.service';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { cloneDeep } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectComponent,
    RichTextStandaloneComponent,
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class CreatePostComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() newsPostCreated = new EventEmitter<string>();
  currentLang = 'vi';

  createForm!: FormGroup;
  imgUrl: any;
  editorData: string = '';
  formTitles: string[] = [];
  imagePreviews: string[] = [];
  postDatas: any[] = [];
  image: string | ArrayBuffer | null = null;
languages: { value: string, label: string }[] = [];

  // languages = [
  //   { value: 'vi', label: 'Vietnamese' },
  //   { value: 'en', label: 'English' },
  // ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePostComponent>,
    private _manageNewsService: ManagementNewsService,
    private _uploadImage: UploadImageService,
    private _alert: AlertService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
      this.initializeSelectStatus();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    });
    this.createForm = this.fb.group({
      forms: this.fb.array([this.createFormGroup()]),
    });
    this.updateFormTitles();
    this.subscribeToFormArrayChanges();

    this.forms.get('content')?.valueChanges.subscribe((value) => {
      this.editorData = value;
    });
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      imageUrl: [null],
      title: ['', Validators.required],
      description: [''],
      content: [''],
      language: ['vi'],
    });
  }
    initializeSelectStatus(): void {
    this.languages = [
      { value: 'vi', label: this.translate.instant('VIET') },
    { value: 'en', label: this.translate.instant('ENG') },
    ];
  }

  get forms(): FormArray {
    return this.createForm.get('forms') as FormArray;
  }

  subscribeToFormArrayChanges(): void {
    this.forms.controls.forEach((control: AbstractControl) => {
      const formGroup = control as FormGroup;
      formGroup.get('language')?.valueChanges.subscribe(() => {
        this.updateFormTitles();
      });
    });
  }

  addForm(): void {
    const firstFormLanguage = this.forms.at(0)?.get('language')?.value;
    const newForm = this.createFormGroup();

    if (firstFormLanguage === 'vi') {
      newForm.get('language')?.setValue('en');
    }

    this.forms.push(newForm);

    this.formTitles.push(this.getTitleForForm(newForm));
    this.imagePreviews.push('');

    newForm.get('language')?.valueChanges.subscribe(() => {
      this.updateFormTitles();
    });

    if (this.forms.length >= 2) {
      this.showAddButton = false;
    }
  }

  getTitleForForm(form: FormGroup): string {
    const languageValue = form.get('language')?.value;
    const language = this.languages.find(
      (lang) => lang.value === languageValue
    );
    
    return `${language?.label || 'Vietnamese'}`;
  }

  updateFormTitles(): void {
    this.formTitles = this.forms.controls.map((control: AbstractControl) => {
      const formGroup = control as FormGroup;
      const languageValue = formGroup.get('language')?.value;
      const language = this.languages.find(
        (lang) => lang.value === languageValue
      );
      return `${language?.label || 'Vietnamese'}`;
    });
  }

  closeCreateModal() {
    this.dialogRef.close();
    this.createForm.reset();
  }

  onImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const formGroup = this.forms.at(index);
        formGroup.patchValue({
          imageUrl: reader.result as string,
          filename: file.name,
        });
      };
      reader.readAsDataURL(file);
      this.uploadImage(file, index);
    }
  }

  uploadImage(file: File, index: number): void {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('type', 'NEWS');

    this._uploadImage.uploadImage(formData).subscribe((data: any) => {
      if (data.errorCode == '000') {
        loadingRef.close();
        const imageUrl = data.result;
        const formGroup = this.forms.at(index);
        formGroup.patchValue({
          imageUrl,
          filename: file.name,
        });
      }
    });
  }

  removeImage(index: number): void {
    const formGroup = this.forms.at(index);
    formGroup.patchValue({
      imageUrl: null,
      filename: '',
    });
  }

  postCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
    } else {
      this.translate
        .get('CONFIRMATION_NCREATE.CREATE')
        .subscribe((confirmationMessage: string) => {
          this._alert
            .confirm(confirmationMessage)
            .subscribe((result: boolean) => {
              if (result) {
                this.createNewsPost();
              }
            });
        });
    }
  }

  transformPostData(data: any): any {
    let result: any = {
      imageUrl: {},
      title: {},
      description: {},
      content: {},
    };

    (data.forms || []).forEach((item: any) => {
      const lang = item.language;

      if (item.imageUrl) {
        result.imageUrl[lang] = item.imageUrl;
      }
      if (item.title) {
        result.title[lang] = item.title;
      }
      if (item.description) {
        result.description[lang] = item.description;
      }
      if (item.content) {
        result.content[lang] = item.content;
      }
    });

    return result;
  }

  createNewsPost() {
    let postData = cloneDeep(this.createForm.value);
    let transformedData = this.transformPostData(postData);
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._manageNewsService
      .createNews(transformedData)
      .subscribe((data: any) => {
        if (data.errorCode === '000') {
          loadingRef.close();
          this.postDatas = data.result;
          this.translate
            .get('NOTIFICATION_NCREATE.CREATE_SUCCESS')
            .subscribe((successMessage: string) => {
              this.dialogRef.close();
              this._alert.notify(successMessage, 'SUCCESS');
            });
          this.newsPostCreated.emit('success');
        } else {
          loadingRef.close();
          this.translate
            .get('NOTIFICATION_NCREATE.CREATE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
  }

  onDataChange(data: string) {
    this.editorData = data;
  }

  // closeNews(){
  //   this.dialogRef.close()
  // }
  showAddButton: boolean = true;
}
