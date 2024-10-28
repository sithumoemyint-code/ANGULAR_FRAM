import { CommonModule } from '@angular/common'
import { Component, EventEmitter, forwardRef, Injector, Input, Output, SimpleChanges } from '@angular/core'
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms'
import { ControlValueAccessorDirective } from '../control-value-accessor/control-value-accessor.directive'
import { TranslateService } from '@ngx-translate/core'

type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'datetime-local'

@Component({
  selector: 'app-icon-input',
  templateUrl: './icon-input.component.html',
  styleUrls: ['./icon-input.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconInputComponent),
      multi: true,
    },
  ],
})
export class IconInputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() required: boolean = true;
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() labelClass: string = '';
  @Input() errors: Record<string, ValidationErrors> | null = {};
  @Input() customErrorMessage: Record<string, string> = {};
  @Input() placeholder: string = '';
  @Input() isDisabled = false;
  @Output() keydown = new EventEmitter<KeyboardEvent>();
  @Input() hideTypeAttribute: boolean = false
  @Input() showIcon: boolean =false
  
  public showCharError: boolean = false;

  // Initially, use translation keys instead of static strings
  errorMessages: Record<string, string> = {
    required: 'ERROR_MESSAGES.REQUIRED',
    pattern: 'ERROR_MESSAGES.PATTERN',
  };

  constructor(private translate: TranslateService,  injector: Injector) {
    super(injector);
    // Initialize error messages with current language
    this.updateErrorMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { customErrorMessages } = changes;
    if (customErrorMessages) {
      this.errorMessages = {
        ...this.errorMessages,
        ...customErrorMessages.currentValue,
      };
    }
    // Update translations if the language changes
    this.updateErrorMessages();
  }

  private updateErrorMessages() {
    this.errorMessages['required'] = this.translate.instant(this.errorMessages['required']);
    this.errorMessages['pattern'] = this.translate.instant(this.errorMessages['pattern']);
  }

  onKeydown(event: KeyboardEvent) {
    this.keydown.emit(event);
  }

  togglePasswordVisibility() {
    this.hideTypeAttribute = !this.hideTypeAttribute
  }
}
