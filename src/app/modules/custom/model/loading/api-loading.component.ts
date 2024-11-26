import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-api-loading',
  templateUrl: './loading.component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
})
export class ApiLoadingComponent {
  // @Output() _create = new EventEmitter<boolean>(false)
  // constructor(
  //   @Inject(MAT_DIALOG_DATA) public data: any,
  //   private dialogRef: MatDialogRef<LoadingComponent>,
  //   private cdr: ChangeDetectorRef
  // ) {}
  // ngOnInit(): void {
  //   this.checkAndCloseDialog()
  // }
  // ngOnChanges(): void {
  //   this.checkAndCloseDialog()
  // }
  // private checkAndCloseDialog() {
  //   if (this.data && this.data.boo === false) {
  //     this.dialogRef.close()
  //   }
  // }
}
