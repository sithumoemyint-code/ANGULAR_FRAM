import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomersService } from '../../customer-child/customers.service';
import { AlertService } from 'src/app/modules/service/alert.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
})
export class CustomerDetailComponent implements OnInit {
  detail: any;
  id: any;
  constructor(
    private _dialogRef: MatDialogRef<CustomerDetailComponent>,
    private _customer: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _alert: AlertService

  ) {
    this.id = data.id
    this._customer.getCustomerDetail(this.id).subscribe((data: any) => {
      if (data.errorCode === "00000") {
        this.detail = data.result;
      } else {
        this._alert.confirmSuccessFail(
          'FAILED!',
          data.message,
          'FAIL'
        );
        this._dialogRef.close();
      }

    });
  }

  ngOnInit(): void {

  }

  closeDetail() {
    this._dialogRef.close();
  }
}
