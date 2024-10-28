import { CommonModule } from '@angular/common'
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges } from '@angular/core'
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-admin-img-upload',
  templateUrl: './admin-img-upload.component.html',
  styleUrls: ['./admin-img-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminImgUploadComponent),
      multi: true
    }
  ],

})
export class AdminImgUploadComponent implements ControlValueAccessor, OnInit {
  @Input() control!: FormControl
  @Input() isImageRequire!: boolean 
  @Output() imageSelected = new EventEmitter<File>()

  @Input() customErrorMessages: Record<string, string> = {}
  @Input() errors: Record<string, ValidationErrors> | null = {}
  @Input() customErrorMessage: Record<string, string> = {}

  selectedImage: string | ArrayBuffer | null = null
  private onChange = (file: File | null) => {}
  private onTouched = () => {}

  ngOnInit(): void {
    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        this.selectedImage = reader.result
      }

      reader.readAsDataURL(file)

      this.onChange(file) // Notify Angular forms about the file change
      this.onTouched() // Notify Angular forms that the input was touched
      this.imageSelected.emit(file)
    }
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('upload') as HTMLInputElement
    fileInput.click()
  }

  // ControlValueAccessor interface methods
  writeValue(value: File | null): void {
    if (typeof value === 'string') this.selectedImage = value
    else this.selectedImage = null 
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle the disabled state of your component
  }

  errorMessages: Record<string, string> = {
    required: 'This field is required',
  }

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
