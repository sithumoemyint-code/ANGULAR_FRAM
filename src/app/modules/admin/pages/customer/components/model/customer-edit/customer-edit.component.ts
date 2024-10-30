import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CustomerEditComponent implements OnInit {
  options = ['Reuse', 'Revoke'];
  selectedOption: string = 'Reuse';

  constructor(private _dialogRef: MatDialogRef<CustomerEditComponent>) {}

  ngOnInit(): void {}

  closeEdit() {
    this._dialogRef.close();
  }
}
