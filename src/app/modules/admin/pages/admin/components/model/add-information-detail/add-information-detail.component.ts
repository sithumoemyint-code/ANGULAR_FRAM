import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-information-detail',
  templateUrl: './add-information-detail.component.html',
  styleUrls: ['./add-information-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class AddInformationDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddInformationDetailComponent>
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  changeFrontNumber(createBy: string) {
    if (isNaN(Number(createBy))) return createBy;

    let result = createBy;

    if (createBy.startsWith('84')) result = '0' + createBy.substring(2);

    return result;
  }
}
