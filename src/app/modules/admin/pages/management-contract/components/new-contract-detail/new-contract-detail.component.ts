import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ManagementContractService } from '../../management-contract.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-new-contract-detail',
  templateUrl: './new-contract-detail.component.html',
  styleUrls: ['./new-contract-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    InputComponent, 
    ReactiveFormsModule,
    TranslateModule]
})
export class NewContractDetailComponent implements OnInit {
  private modal!: MatDialogRef<any>;
  @Output() approved = new EventEmitter<string>()
  @Output() cancelled = new EventEmitter<string>()
  @ViewChild('cancelRequestFinalModal') cancelRequestFinalModal!: TemplateRef<any>;
 
  cancelReqForm !: FormGroup;

  pass : any
  contractInfo : any  = {} 
  status : any []  = []
  currentLang = 'vi'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewContractDetailComponent>,
    private dialog: MatDialog,
    private _manageContractService : ManagementContractService,
    private _alert : AlertService,
    private fb: FormBuilder,
    private languageService : LanguageService,
    private translate : TranslateService

  )
  {
    this.pass = data.dataPass
  }
  ngOnInit(): void {
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;      
    });
    this.cancelReqForm = this.fb.group({
      resason: [''],
     })
    this.detailContract();
  }

  detailContract(){
    let id = this.pass.id;
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true});
    this._manageContractService.detailContract({id}).subscribe((data:any) => {
      if(data.errorCode === '000'){
      loadingRef.close()
          this.contractInfo = data.result
          if (this.contractInfo.createdAt) {
    this.contractInfo.createdAt = moment(this.contractInfo.createdAt).format('DD/MM/YY');
        }
        
        if (this.contractInfo.fromTime) {
    this.contractInfo.fromTime = moment(this.contractInfo.fromTime).format('DD/MM/YY');
        }
        
                if (this.contractInfo.toTime) {
    this.contractInfo.toTime = moment(this.contractInfo.toTime).format('DD/MM/YY');
        }
        
if (this.contractInfo.interestPaymentHistories) {
    this.contractInfo.interestPaymentHistories.forEach((history: any) => {
        if (history.paymentPeriodTime) {
            history.paymentPeriodTime = moment(history.paymentPeriodTime).format('DD/MM/YY');
        }
    });
}
      }      
    })
  }

  closeNewContractDetail(){
    this.dialogRef.close()
  }

  detailApprove(id : string) {
   
   this.translate.get('CONFIRMATION_CLAPPROVE.APPROVE').subscribe((confirmationMessage:string)=>{
    this._alert.confirm(confirmationMessage).subscribe((result: boolean)=>{
      if(result){
        const loadingRef = this.dialog.open(ApiLoadingComponent, {
          disableClose: true});
        const newStatus = 'ACTIVE';
        this._manageContractService.listChangeStatus({id, status: newStatus}).subscribe(
          (data: any) => {
              if (data.errorCode === '000') {
                loadingRef.close()
                if(data.status === 'PENDING'){
                  data.status = newStatus; 
                }
                this.translate.get('NOTIFICATION_CLAPPROVE.APPROVE_SUCCESS').subscribe((successMessage:string)=>{
                  this._alert.notify(successMessage, 'SUCCESS');
                   if (this.dialog) {
                    this.dialogRef.close();
                   }
                 })
                this.approved.emit('success')
                  }
                  else {
                    loadingRef.close()
                    this.translate.get('NOTIFICATION_CLAPPROVE.APPROVE_FAIL').subscribe((failMessage: string) => {
                      this._alert.notify(failMessage, 'FAIL');
                    });
                  }
          },
          (error: any) => {
              console.error('API Error:', error); 
          }
      );
    }
    })
   })

    this.modal.close()

}

detailCancelRequest(id :string) {
  
  this.modal = this.dialog.open(this.cancelRequestFinalModal ,{
      width: '40%',
      disableClose: true,
    data: { id },
      
  });
  }

  cancelReq(){
    this.modal.close();
    this.translate.get('CONFIRMATION_CLCANCEL.CANCEL').subscribe((confirmationMessage:string)=>{
      this._alert.confirm(confirmationMessage).subscribe((result: boolean)=>{
        if(result){
          const loadingRef = this.dialog.open(ApiLoadingComponent, {
            disableClose: true});
          const id = this.pass.id
          const newStatus = 'CANCEL';
          const reason = this.cancelReqForm.get('reason')?.value
          this._manageContractService.listChangeStatus({id: id, status: newStatus, reason: reason}).subscribe(
            (data: any) => {
              if (data.errorCode === '000') {
                loadingRef.close()
                  if (data.status === 'PENDING') {
                      data.status = newStatus; 
                  }
                  this.translate.get('NOTIFICATION_CLCANCEL.CANCEL_SUCCESS').subscribe((successMessage:string)=>{
                    this._alert.notify(successMessage, 'SUCCESS');
                    if (this.dialog) {
                      this.dialogRef.close();
                   }
                   })
                  this.cancelled.emit('success')
              } else {
                loadingRef.close()
                this.translate.get('NOTIFICATION_CLCANCEL.CANCEL_FAIL').subscribe((failMessage: string) => {
                  this._alert.notify(failMessage, 'FAIL');
                });
              }
          })
        }  
      })
    })
  }
  closeDetailCancelReq(){
    this.modal.close()
  }
  closeDetail() {
     this.dialogRef.close();
  }
}
