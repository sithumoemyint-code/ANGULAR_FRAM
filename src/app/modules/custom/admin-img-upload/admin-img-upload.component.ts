import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

type InputType = 'image' | 'excel';

@Component({
  selector: 'app-admin-img-upload',
  templateUrl: './admin-img-upload.component.html',
  styleUrls: ['./admin-img-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminImgUploadComponent),
      multi: true,
    },
  ],
})
export class AdminImgUploadComponent implements ControlValueAccessor, OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @Input() control!: FormControl;
  @Input() isImageRequire!: boolean;
  @Output() imageSelected = new EventEmitter<File | null>();
  @Input() file: InputType = 'image';
  @Output() fileRemoved = new EventEmitter<string>();
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() errors: Record<string, ValidationErrors> | null = {};
  @Input() customErrorMessage: Record<string, string> = {};

  selectedImage: string | ArrayBuffer | null = null;
  private onChange = (file: File | null) => {};
  private onTouched = () => {};
  fileName: string | null = null;

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    if (this.file === 'image') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          this.selectedImage = reader.result;
        };

        reader.readAsDataURL(file);

        this.onChange(file);
        this.onTouched();
        this.imageSelected.emit(file);
      }
    } else if (this.file === 'excel') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const fileType = file.name.split('.').pop()?.toLowerCase();

        if (fileType === 'xls' || fileType === 'xlsx') {
          this.fileName = file.name;
          this.onChange(file);
          this.imageSelected.emit(file);
        } else {
          alert('Please upload an Excel file (.xls or .xlsx)');
          input.value = '';
        }
      }
    }
  }

  removeFile() {
    this.fileName = '';
    this.selectedImage = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemoved.emit('success');
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('upload') as HTMLInputElement;
    fileInput.click();
  }

  // ControlValueAccessor interface methods
  writeValue(value: File | null): void {
    if (typeof value === 'string') this.selectedImage = value;
    else this.selectedImage = null;
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle the disabled state of your component
  }

  errorMessages: Record<string, string> = {
    required: 'This field is required',
  };

  ngOnChanges(changes: SimpleChanges): void {
    // const { customErrorMessages } = changes
    // if (customErrorMessages) {
    //   this.errorMessages = {
    //     ...this.errorMessages,
    //     ...customErrorMessages.currentValue,
    //   }
    // }
  }
}
