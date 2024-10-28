import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContractDetailComponent } from '../contract-detail/contract-detail.component';
import { CustomerService } from '../../customer.service';
import { ManagementContractService } from '../../../management-contract/management-contract.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PaginatorComponent],
})
export class AccountDetailComponent implements OnInit {
  _dialogRef!: MatDialogRef<any>;
  detail: any = {};
  contractHistory: any = {};
  createdBy: any;
  element: any;
  avatar: any;

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private manageContractService: ManagementContractService
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      data: { element: any; createdBy: any; avatar: any };
    };
    this.detail = history.state.data;
    this.createdBy = history.state.data.createdBy;
    this.avatar = history.state.data.avatar;
    this.forDetailHistory();
  }

  forDetailHistory(offset: number = 0) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    const userNamePhoneEmail =
      this.detail.element.fullName ||
      this.detail.element.email ||
      this.detail.element.phoneNumber;
    this.manageContractService
      .list({ userNamePhoneEmail })
      .subscribe((data: any) => {
        if (data.errorCode === '000') {
          loadingRef.close();
          this.contractHistory = data.result.content;
        }
        this.totalOffset = data.result.totalPages - 1;
      });
  }

  contractDetail(item: any) {
    this.dialog.open(ContractDetailComponent, {
      width: '55%',
      height: '90%',
      disableClose: false,
      data: { dataPass: item },
    });
  }
}
