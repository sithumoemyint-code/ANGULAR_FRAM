import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
})
export class CustomerDetailComponent implements OnInit {
  constructor(private _dialogRef: MatDialogRef<CustomerDetailComponent>) {}

  ngOnInit(): void {}

  closeDetail() {
    this._dialogRef.close();
  }
}
