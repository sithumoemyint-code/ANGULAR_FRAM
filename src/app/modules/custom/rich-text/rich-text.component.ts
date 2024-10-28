import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';

@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RichTextComponent implements OnInit, OnDestroy {
  editordoc: any;
  editor!: Editor;

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

  constructor() {}

  ngOnInit(): void {
    this.editor = new Editor();
  }

  form = new FormGroup({
    editorContent: new FormControl(
      { value: '', disabled: false },
      Validators.required()
    ),
  });

  // get doc(): AbstractControl {
  //   return this.form.get('editorContent');
  // }
  get doc(): AbstractControl<any, any> | null {
    return this.form.get('editorContent');
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
