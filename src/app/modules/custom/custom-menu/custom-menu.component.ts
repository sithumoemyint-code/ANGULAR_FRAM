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
@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss']
})
export class CustomMenuComponent implements OnInit, AfterViewInit {
  editorView!: EditorView;
  @Input() editor!: Editor;
  isActive = false;
  isDisabled = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editorElement') editorElement!: ElementRef;

  constructor() {}
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
      this.insertImage(imageUrl);
    };
    reader.readAsDataURL(file);
  }
  insertImage(imageUrl: string): void {
    const { state, dispatch } = this.editor.view;
    const { schema } = state;
    const node = schema.nodes['image'].create({ src: imageUrl });

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
