import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, TranslateModule],
})
export class PasswordDialogComponent implements OnInit {
  loading: boolean = false;
  @Output() _show = new EventEmitter<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PasswordDialogComponent>
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
