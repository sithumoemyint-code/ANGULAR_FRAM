import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManagementContractService } from '../../../management-contract/management-contract.service';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class ContractDetailComponent implements OnInit {
  private modal!: MatDialogRef<any>;

  currentLang = 'vi'
  pass : any
  contractHistory : any

  constructor(
    private _dialogRef: MatDialogRef<ContractDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ,
    private manageContractService: ManagementContractService,
  private languageService : LanguageService
  ) {
    this.pass = data.dataPass
  }
 
  ngOnInit(): void {
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;      
    });  
    this.forDetailHistory()  
  }

  forDetailHistory(){
    const id = this.pass
    this.manageContractService.detailContract({id}).subscribe((data : any) => {
      if(data.errorCode === '000'){
      this.contractHistory = data.result;

if (this.contractHistory.createdAt) {
    this.contractHistory.createdAt = moment(this.contractHistory.createdAt).format('DD/MM/YY');
        }
        
        if (this.contractHistory.fromTime) {
    this.contractHistory.fromTime = moment(this.contractHistory.fromTime).format('DD/MM/YY');
        }
        
                if (this.contractHistory.toTime) {
    this.contractHistory.toTime = moment(this.contractHistory.toTime).format('DD/MM/YY');
        }
        
if (this.contractHistory.interestPaymentHistories) {
    this.contractHistory.interestPaymentHistories.forEach((history: any) => {
        if (history.paymentPeriodTime) {
            history.paymentPeriodTime = moment(history.paymentPeriodTime).format('DD/MM/YY');
        }
    });
        }
        console.log(this.contractHistory.interestPaymentHistories, 'this is the interest payment history');
        
      }

    })
  }

  closeDetail() {
    this._dialogRef.close();
  }
}
