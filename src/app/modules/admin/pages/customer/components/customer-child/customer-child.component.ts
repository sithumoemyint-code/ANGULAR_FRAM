import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomerDetailComponent } from '../model/customer-detail/customer-detail.component';
import { CustomerEditComponent } from '../model/customer-edit/customer-edit.component';

@Component({
  selector: 'app-customer-child',
  templateUrl: './customer-child.component.html',
  styleUrls: ['./customer-child.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class CustomerChildComponent implements OnInit {
  _dialogRef!: MatDialogRef<any>;
  dataSourcePending = [
    {
      no: 1,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Pending',
    },
    {
      no: 2,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Pending',
    },
    {
      no: 3,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Pending',
    },
  ];

  dataSourceRevoke = [
    {
      no: 1,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Revoke',
    },
    {
      no: 2,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Revoke',
    },
    {
      no: 3,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Revoke',
    },
  ];

  dataSourceReuse = [
    {
      no: 1,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Reuse',
    },
    {
      no: 2,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Reuse',
    },
    {
      no: 3,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Reuse',
    },
  ];
  currentDataSource = this.dataSourcePending;
  activeButton = 'Pending';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  showDataSource(dataSource: any[], button: string) {
    this.currentDataSource = dataSource;
    this.activeButton = button;
  }

  showDetail() {
    this._dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: '50%',
      disableClose: true,
    });
  }

  openEdit() {
    this._dialogRef = this.dialog.open(CustomerEditComponent, {
      width: '50%',
      disableClose: true,
    });
  }
}
