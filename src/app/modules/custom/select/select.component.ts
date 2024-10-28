import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, SimpleChanges } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor/control-value-accessor.directive';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() selectId = '';
  @Input() label = '';
  @Input() options: { value: any; label: string }[] = [];
  @Input() required: boolean = true;
  @Input() placeholder: string = '';
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() errors: Record<string, ValidationErrors> | null = {};
  @Input() customErrorMessage: Record<string, string> = {};

  @Input() controlName!: string;

  errorMessages: Record<string, string> = {
    required: 'This field is required',
  };

  ngOnChanges(changes: SimpleChanges): void {
    const { customErrorMessages } = changes;
    if (customErrorMessages) {
      this.errorMessages = {
        ...this.errorMessages,
        ...customErrorMessages.currentValue,
      };
    }
  }
}
