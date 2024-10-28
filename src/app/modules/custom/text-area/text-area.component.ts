import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor/control-value-accessor.directive';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    }
  ]
})
export class TextAreaComponent<T> extends ControlValueAccessorDirective<T>  {
  @Input() textAreaId = ''
  @Input() label = ''
  @Input() required: boolean = true
  @Input() customErrorMessages: Record<string, string> = {}
  @Input() labelClass: string = ''
  @Input() errors: Record<string, ValidationErrors> | null = {}
  @Input() customErrorMessage: Record<string, string> = {}
  @Input() placeholder: string = ''

  errorMessages: Record<string, string> = {
    required: 'This field is required',
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { customErrorMessages } = changes
    if (customErrorMessages) {
      this.errorMessages = {
        ...this.errorMessages,
        ...customErrorMessages.currentValue,
      }
    }
  }
}
