import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-success-fail',
  templateUrl: './confirm-success-fail.component.html',
  styleUrls: ['./confirm-success-fail.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, TranslateModule],
})
export class ConfirmSuccessFailComponent implements OnInit {
  loading: boolean = false;
  @Output() _create = new EventEmitter<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmSuccessFailComponent>
  ) {}

  ngOnInit(): void {}

  create() {
    this.loading = true;
    this._create.emit(true);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
