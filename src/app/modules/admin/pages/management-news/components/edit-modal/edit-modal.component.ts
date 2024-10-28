import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreatePostComponent } from '../create-post/create-post.component';
import { RichTextStandaloneComponent } from 'src/app/modules/custom/rich-text-standalone/rich-text-standalone.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { UploadImageService } from 'src/app/modules/service/upload-image.service';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ManagementNewsService } from '../../management-news.service';
import { cloneDeep } from 'lodash';
import { Editor } from 'ngx-editor';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  standalone: true,
  imports: [
    RichTextStandaloneComponent, 
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    TranslateModule,
  MatIconModule]
})
export class EditModalComponent {
  @Output() editNewsCreated = new EventEmitter<string>()
  currentLang = 'vi';
  editor!: Editor;
  createForm !: FormGroup;
  finalEdit : any [] = [];
  formTitles: string[] = [];
  imagePreviews: string[] = [];

  pass: any;
  _imgUrl: any;
  editorData: string = '';
  imageUrlIndex: number = 0; 
  fileName: string | null = null;
  showAddButton: boolean = true;
languages: { value: string, label: string }[] = [];

  // languages = [
  //     { value: 'vi', label: 'Vietnamese' },
  //     { value: 'en', label: 'English' },
  //   ]

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,
  private fb: FormBuilder,
  public dialogRef: MatDialogRef<CreatePostComponent>,
  private _uploadImage: UploadImageService,
  private _alert: AlertService,
  private _manageNewsService : ManagementNewsService,
  private translate: TranslateService,
    private languageService: LanguageService
){
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
      this.editor = new Editor();

      this.createForm = this.fb.group({
        forms: this.fb.array([ this.createFormGroup('vi'),
          this.createFormGroup('en')]),
      });         

      this.updateFormTitles();
      this.subscribeToFormArrayChanges();
      this.createForm.get('content')?.valueChanges.subscribe(value => {
        this.editorData = value;      
      });

      this.fetchData()
  }
   initializeSelectStatus(): void {
    this.languages = [
      { value: 'vi', label: this.translate.instant('VIET') },
    { value: 'en', label: this.translate.instant('ENG') },
    ];
  }
  createFormGroup(language: string): FormGroup {
    return this.fb.group({
      imageUrl: [null],
      title: [''],
      description: [''],
      content: [''],
      language: [language],
    });
  }

  fetchData(){
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true
    })
    let toFetchData = this.pass.id
    this._manageNewsService.newsDetail({id:toFetchData}).subscribe((data:any) => {
      if( data.errorCode === '000'){
        loadingRef.close()
        const apiData = data.result;
        this.patchData(apiData);
      }
    })
  }

  patchData(apiData: any) {
    const formArray = this.createForm.get('forms') as FormArray;
  
    formArray.controls.forEach((control, index) => {
      if (control instanceof FormGroup) {
        const formGroup = control as FormGroup;
        const language = formGroup.get('language')?.value;
  
        if (apiData.imageUrl && apiData.imageUrl[language]) {
          formGroup.patchValue({
            imageUrl: apiData.imageUrl[language],
          });
        }
  
        if (apiData.description && apiData.description[language]) {
          formGroup.patchValue({
            description: apiData.description[language],
          });
        }
  
        if (apiData.title && apiData.title[language]) {
          formGroup.patchValue({
            title: apiData.title[language],
          });
        }
  
        if (apiData.content && apiData.content[language]) {
          formGroup.patchValue({
            content: apiData.content[language],
          });
        }
  
        this.imagePreviews[index] = apiData.imageUrl ? apiData.imageUrl[language] || '' : '';
        
      }
    });
  }
  
  updateFormTitles(): void {
    this.formTitles = this.forms.controls.map((control: AbstractControl) => {
      const formGroup = control as FormGroup; 
      const languageValue = formGroup.get('language')?.value;
      const language = this.languages.find(lang => lang.value === languageValue);
      return `${language?.label || 'Vietnamese'}`;
    });
  }

  subscribeToFormArrayChanges(): void {
    this.forms.controls.forEach((control: AbstractControl) => {
      const formGroup = control as FormGroup;
      formGroup.get('language')?.valueChanges.subscribe(() => {
        this.updateFormTitles();
      });
    });
  }
  
  get forms(): FormArray {
    return this.createForm.get('forms') as FormArray;
  }

  closeCreateModal(){
    this.dialogRef.close();
    this.createForm.reset()  
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
          filename: file.name 
        });
      };
      reader.readAsDataURL(file);
      this.uploadImage(file, index);
    }
  }

  uploadImage(file: File, index: number): void {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true
    })
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name); 
    formData.append('type', 'NEWS');
   
    this._uploadImage.uploadImage( formData).subscribe((data:any) => {
      if(data.errorCode == '000'){
        loadingRef.close()
      const imageUrl = data.result; 
      const formGroup = this.forms.at(index);
      formGroup.patchValue({
        imageUrl,
        filename: file.name 
      });
      }   
    });
  }

  removeImage(index: number): void {
    const formGroup = this.forms.at(index);
    formGroup.patchValue({
      imageUrl: null,
      filename: ''
    });
  }

  saveEdit() {    
      if (this.createForm.invalid) {
      this.createForm.markAllAsTouched()
    } else {
    this.translate.get('CONFIRMATION_NEDIT.EDIT').subscribe((confirmationMessage:string)=>{
      this._alert.confirm(confirmationMessage).subscribe((result: boolean) => {
          if (result) {
            this.onEditNewsPost()
          }
        });
    })
    }
  } 

  transformPostData(data: any): any {
    let result: any = {
      imageUrl: {},
      title: {},
      description: {},
      content: {}
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

  onEditNewsPost(){
    let edit = cloneDeep(this.createForm.value)
    let transformedData = this.transformPostData(edit);
    transformedData.id = this.pass.id; 
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true
    })
    this._manageNewsService.updateNews(transformedData).subscribe((data:any)=>{
      if(data.errorCode === '000'){
        loadingRef.close()
        this.finalEdit = data.result
        this.translate.get('NOTIFICATION_NEDIT.EDIT_SUCCESS').subscribe((successMessage: string) => {
    this.dialogRef.close();
          this._alert.notify(successMessage, 'SUCCESS');
         })
        this.editNewsCreated.emit('success')
      }
      else  {
        loadingRef.close()
        this.translate.get('NOTIFICATION_NEDIT.EDIT_FAIL').subscribe((failMessage: string) => {
          this._alert.notify(failMessage, 'FAIL');
        });
      }
    })
  }

  onDataChange(data: string) {
    this.editorData = data;
  }
  
}
