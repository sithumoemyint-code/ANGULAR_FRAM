import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-success-and-fail-dialog',
  templateUrl: './success-and-fail-dialog.component.html',
  styleUrls: ['./success-and-fail-dialog.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, TranslateModule],
})
export class SuccessAndFailDialogComponent implements OnInit {
  loading: boolean = false;
  @Output() _show = new EventEmitter<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuccessAndFailDialogComponent>
  ) {}

  ngOnInit(): void {}

  create() {
    this.loading = true;
    this._show.emit(true);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
