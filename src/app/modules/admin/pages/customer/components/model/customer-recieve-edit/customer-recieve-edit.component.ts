import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomersService } from '../../customer-child/customers.service';
import { AlertService } from 'src/app/modules/service/alert.service';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-recieve-edit',
  templateUrl: './customer-recieve-edit.component.html',
  styleUrls: ['./customer-recieve-edit.component.scss'],
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
export class CustomerRecieveEditComponent implements OnInit {
  detail: any;
  id: any;
  status: any;
  options = ['RECIEVED_ONU'];
  selectedOption: string = '';
  @Output() editSuccess = new EventEmitter<string>();
  constructor(
    private _dialogRef: MatDialogRef<CustomerRecieveEditComponent>,
    private _customer: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _alert: AlertService
  ) {
    this.id = data.id;
    this.status = data.status;
    this._customer.getCustomerDetail(this.id).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        this.detail = data.result;
        this.selectedOption = data.result.status;
      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  closeEdit() {
    this._dialogRef.close();
  }
  getStatus() {
    //
  }
  update() {
    this._alert
      .confirmSuccessFail(
        'Confirm',
        'Are you sure do you want to update?',
        'SURE'
      )
      .subscribe((value: any) => {
        if (value) {
          this.confirmUpdate();
        }
      });
  }

  confirmUpdate() {
    // let body = {
    //   requestId: Date.now().toString(),
    //   requestTime: Date.now().toString(),
    //   status: this.status,
    // };
    this._customer
      .editRecievedStatus(this.id, { status: this.status })
      .subscribe(
        (data: any) => {
          if (data.errorCode === '00000') {
            this._alert.confirmSuccessFail('SUCCESS!', data.message, 'SUCCESS');
            this.closeEdit();
            this.editSuccess.emit('success');
          } else {
            this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
          }
        },
        (err) => {
          this._alert.confirmSuccessFail(
            'FAILED!',
            'Something went wrong.',
            'FAIL'
          );
          this.closeEdit();
        }
      );
  }
}
