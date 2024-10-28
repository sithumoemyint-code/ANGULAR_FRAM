import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddNoteComponent } from '../add-note/add-note.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class FeedbackDetailComponent implements OnInit {
  private _modal!: MatDialogRef<any>

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FeedbackDetailComponent>,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  process() {
    this.dialogRef.close()
    this._modal = this._dialog.open(AddNoteComponent, {
      width: '40%',
      disableClose: false,
      data: this.data.id
    })
  }

  close() {
    this.dialogRef.close()
  }
}
