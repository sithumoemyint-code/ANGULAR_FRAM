import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, forwardRef} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { CustomMenuStandaloneComponent } from '../custom-menu-standalone/custom-menu-standalone.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rich-text-standalone',
  templateUrl: './rich-text-standalone.component.html',
  styleUrls: ['./rich-text-standalone.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgxEditorModule,CustomMenuStandaloneComponent, CommonModule,ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextStandaloneComponent),
      multi: true
    }
  ]
})
export class RichTextStandaloneComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Output() dataChange = new EventEmitter<string>();
  editordoc: any;
  // editor!: Editor;
  richTextForm !: FormGroup

  @Input() content: string = '';
  @Input() editor!: Editor;
  formControl!: FormControl;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
    ['undo', 'redo'],
  ];

  constructor( private fb: FormBuilder,) {}
  writeValue(obj: any): void {
    this.richTextForm.get('editorControl')?.setValue(obj, { emitEvent: false });
    this.formControl.setValue(obj, { emitEvent: false });
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
    this.formControl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.richTextForm.disable() : this.richTextForm.enable();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.richTextForm = this.fb.group({
      content: ['']  
    });

    this.formControl = new FormControl(this.content);

    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
    });

    this.richTextForm.get('content')?.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }
  
  get doc(): AbstractControl<any, any> | null {
    return this.richTextForm.get('content');
  }

  sendData() {
    const data = this.richTextForm.get('content')?.value;
    this.dataChange.emit(data);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
