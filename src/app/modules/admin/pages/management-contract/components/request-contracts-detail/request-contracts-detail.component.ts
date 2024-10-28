import { Component, Inject, OnInit } from '@angular/core';
import { InputComponent } from "../../../../../custom/input/input.component";
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ManagementContractService } from '../../management-contract.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-request-contracts-detail',
  templateUrl: './request-contracts-detail.component.html',
  styleUrls: ['./request-contracts-detail.component.scss'],
  standalone: true,
  imports: [InputComponent, MatIconModule, CommonModule, TranslateModule]
})

export class RequestContractsDetailComponent implements OnInit {
  currentLang = 'vi'
  pass: any;
  viewDetailContract: any  = {};

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<RequestContractsDetailComponent>,
  private _manageContracts : ManagementContractService,
  private dialog: MatDialog,
  private _alert : AlertService,
  private languageService: LanguageService,
  private translate : TranslateService
){
  this.pass = data.dataPass;
}
ngOnInit(): void {
  this.viewContract()
  this.languageService.currentLang$.subscribe(lang => {
    this.currentLang = lang;      
  });
}

viewContract() {
  const id = this.pass;
  const loadingRef = this.dialog.open(ApiLoadingComponent, {
    disableClose: true});
  this._manageContracts.contractDetail({ id }).subscribe((data: any) => {
    if (data.errorCode === '000') {
      loadingRef.close()
      this.viewDetailContract = data.result;      
              if (this.viewDetailContract.createdAt) {
    this.viewDetailContract.createdAt = moment(this.viewDetailContract.createdAt).format('DD/MM/YY');
        }
        
        if (this.viewDetailContract.fromTime) {
    this.viewDetailContract.fromTime = moment(this.viewDetailContract.fromTime).format('DD/MM/YY');
        }
        
                if (this.viewDetailContract.toTime) {
    this.viewDetailContract.toTime = moment(this.viewDetailContract.toTime).format('DD/MM/YY');
        }
    } else {
    this.dialogRef.close();
      loadingRef.close()
       this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                  this._alert.notify(failMessage, 'FAIL');
                });
    }
  });
}

  closeEditReqContracts(){
    this.dialogRef.close();
  }
}
