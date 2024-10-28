import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor/control-value-accessor.directive';
import { TranslateService } from '@ngx-translate/core';

type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'datetime-local';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() required: boolean = true;
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() labelClass: string = '';
  @Input() errors: Record<string, ValidationErrors> | null = {};
  @Input() customErrorMessage: Record<string, string> = {};
  @Input() placeholder: string = '';
  @Input() isDisabled: boolean = false;
  @Output() keydown = new EventEmitter<KeyboardEvent>();
  @Input() shouldFormat: boolean = false;
  @Input() max = '';
  @Input() min = '';

  public showCharError: boolean = false;

  // Initially, use translation keys instead of static strings
  errorMessages: Record<string, string> = {
    required: 'ERROR_MESSAGES.REQUIRED',
    pattern: 'ERROR_MESSAGES.PATTERN',
  };

  constructor(private translate: TranslateService, injector: Injector) {
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
    this.errorMessages['required'] = this.translate.instant(
      this.errorMessages['required']
    );
    this.errorMessages['pattern'] = this.translate.instant(
      this.errorMessages['pattern']
    );
  }

  onKeydown(event: KeyboardEvent) {
    this.keydown.emit(event);
  }

  onInputChange(event: any): void {
    if (this.shouldFormat) this.formatAmount(event);
  }

  formatAmount(event: any): void {
    const input = event.target;
    const value = input.value.replace(/,/g, '');

    if (value === '') {
      input.value = '';
      return;
    }

    if (!isNaN(value)) input.value = Number(value).toLocaleString();
  }
}
