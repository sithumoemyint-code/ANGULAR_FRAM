import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { setBlockType } from 'prosemirror-commands';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Editor, schema } from 'ngx-editor';
import { isNodeActive } from 'ngx-editor/helpers';
import { CommonModule } from '@angular/common';
import { UploadImageService } from '../../service/upload-image.service';
@Component({
  selector: 'app-custom-menu-standalone',
  templateUrl: './custom-menu-standalone.component.html',
  styleUrls: ['./custom-menu-standalone.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomMenuStandaloneComponent {
  editorView!: EditorView;
  @Input() editor!: Editor;
  isActive = false;
  isDisabled = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editorElement') editorElement!: ElementRef;

  constructor(
  private _uploadImage: UploadImageService
  ) {}
  ngOnInit(): void {
    const plugin = new Plugin({
      key: new PluginKey(`custom-menu-codemirror`),
      view: () => {
        return {
          update: this.update,
        };
      },
    });

    this.editor.registerPlugin(plugin);
  }

  ngAfterViewInit() {
    if (this.fileInput && this.editorElement) {
      this.editorView = new EditorView(this.editorElement.nativeElement, {
        state: EditorState.create({ schema }),
        dispatchTransaction: (tr) => {
          const newState = this.editorView.state.apply(tr);
          this.editorView.updateState(newState);
        },
      });
    } else {
      console.error('fileInput or editorElement is not defined.');
    }
  }

  onClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.execute(state, dispatch);
    this.fileInput.nativeElement.click();
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      // this.insertImage(imageUrl);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name); 
    formData.append('type', 'NEWS');
      this._uploadImage.uploadImage(formData).subscribe((data:any)=>{
        if(data.errorCode === '000'){
          const image = data.result
          this.insertImage(image)
        }
      })
    };
    reader.readAsDataURL(file);
  }
  
  insertImage(image: string): void {
    const { state, dispatch } = this.editor.view;
    const { schema } = state;
    const node = schema.nodes['image'].create({ src: image });

    const transaction = state.tr.replaceSelectionWith(node);
    dispatch(transaction);
  }
  execute(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const { schema } = state;

    if (this.isActive) {
      return setBlockType(schema.nodes['paragraph'])(state, dispatch);
    }

    return setBlockType(schema.nodes['code_mirror'])(state, dispatch);
  }

  update = (view: EditorView) => {
    const { state } = view;
    const { schema } = state;
    this.isActive = isNodeActive(state, schema.nodes['code_mirror']);
    this.isDisabled = !this.execute(state, undefined); // returns true if executable
  };
}

