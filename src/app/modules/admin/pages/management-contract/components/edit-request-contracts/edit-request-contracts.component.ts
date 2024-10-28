import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { ConfirmComponent } from 'src/app/modules/custom/model/confirm/confirm.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { ManagementContractService } from '../../management-contract.service';
import { cloneDeep } from 'lodash';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-request-contracts',
  templateUrl: './edit-request-contracts.component.html',
  styleUrls: ['./edit-request-contracts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    SelectComponent,
    ReactiveFormsModule,
    MatIconModule,
    ConfirmComponent,
    TranslateModule
  ],
})
export class EditRequestContractsComponent implements OnInit {
  @Output() editContract = new EventEmitter<string>();
  currentLang = 'vi'
  editContractsForm!: FormGroup;
  editControl = new FormControl();

  editSuggestions: boolean = false;
  editData: {
    fullName: string;
    phoneNumber: string;
    assignAccountId: string;
  }[] = [];
  editDataSuggestions: string[] = [];

  pass: any;
  assignId: any;
  assignName : any

  allAdmin: any[] = [];
  editedContract: [] = [];

  viewDetailContract: any = {};
  inputValue: any;
selectStatus: { value: string, label: string }[] = [];

  // selectStatus = [
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'IN_PROGRESS', label: 'In Progress' },
  //   { value: 'COMPLETE', label: 'Complete' },
  // ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditRequestContractsComponent>,
    private manageContractService: ManagementContractService,
    private _alert: AlertService,
  private languageService : LanguageService,
  private translate : TranslateService
  ) {
    this.pass = data.dataPass;
  }

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;      
    });
      this.initializeSelectStatus();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    });
    this.editContractsForm = this.fb.group({
      status: [this.pass.status],
      assignAccountFullName: [''],
      note: [this.pass.note],
    });
       this.editControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) =>
      {
        this.inputValue = value;
        this.onInputChange(value || '')
      }
        );
    this.editContractsForm
      .get('assignAccountFullName')
      ?.valueChanges.subscribe((value) => {
        if (value !== this.editControl.value) {
          this.editControl.setValue(value, { emitEvent: false });
        }
      });
    this.viewContract();
    this.fetchAllAdminAcc();
  }

  fetchAllAdminAcc() {
    this.manageContractService.getAllAdminAcc().subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.allAdmin = data.result;
        this.editData = data.result.map(
          (item: { fullName: any; accountId: any; phoneNumber: any }) => ({
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            assignAccountId: item.accountId,
          })
        );
      } else {
         this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                this._alert.notify(failMessage, 'FAIL');
              });
      }
    });
  }
  initializeSelectStatus(): void {
    this.selectStatus = [
      { value: 'PENDING', label: this.translate.instant('STATUS_PENDING') },
      { value: 'IN_PROGRESS', label: this.translate.instant('STATUS_IN_PROGRESS') },
      { value: 'COMPLETE', label: this.translate.instant('STATUS_COMPLETE') },
    ];
  }
onInputChange(value: string) {
  if (value) {
    const lowerCaseValue = value.toLowerCase();
    const isPhoneNumberSearch = !isNaN(Number(lowerCaseValue.replace(/\s+/g, '')));
    this.editDataSuggestions = this.editData
      .filter(item => {
        const itemPhoneNumber = item.phoneNumber.toLowerCase();
        const itemFullName = item.fullName.toLowerCase();
        if (isPhoneNumberSearch) {
          return itemPhoneNumber.includes(lowerCaseValue);
        } else {
          return itemFullName.includes(lowerCaseValue);
        }
      })
      .map(item => `${item.fullName} - ${item.phoneNumber}`); 
  } else {
    this.editDataSuggestions = [];
  }
}

  selectSuggestion(suggestion: string) {
  const [fullName, phoneNumber] = suggestion.split(' - ');
  this.editContractsForm.get('assignAccountFullName')?.setValue(suggestion);
  const selectedItem = this.editData.find(item => 
    item.fullName.toLowerCase() === fullName.toLowerCase() &&
    item.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()
  );
  if (selectedItem) {
    this.assignId = selectedItem.assignAccountId;  
    this.assignName = selectedItem.fullName;  
  }
    this.editDataSuggestions = [];
    this.inputValue = ''
}
  hideSuggestions() {
    setTimeout(() => (this.editSuggestions = false), 200);
  }
  closeEditReq() {
    this.dialogRef.close();
  }

  saveEditReq() {
    this.translate.get('CONFIRMATION_CEDIT.EDIT').subscribe((confirmationMessage:string)=>{
      this._alert.confirm(confirmationMessage).subscribe((result: boolean) => {
        if (result) {
        const loadingRef = this.dialog.open(ApiLoadingComponent, {
          disableClose: true,
        });
        const assignName = this.editContractsForm.value.assignAccountFullName
        const [fullName, phoneNumber] = assignName.split(' - ');
        const lowerCaseFullName = fullName.toLowerCase();
        const res = this.editData.find((item: any) => item.fullName.toLowerCase() === lowerCaseFullName);
        const result = res?.assignAccountId;
        let form = cloneDeep(this.editContractsForm.value);
        form.id = this.pass.id;
          form.assignAccountId = result;
        this.manageContractService.editContract(form).subscribe((data: any) => {
          if (data.errorCode === '000') {
            loadingRef.close();
            this.editedContract = data.result;
            this.translate.get('NOTIFICATION_CEDIT.EDIT_SUCCESS').subscribe((successMessage: string) => {
            this.dialogRef.close();
              this._alert.notify(successMessage, 'SUCCESS');
             })
            this.editContract.emit('success');
          } else {
            loadingRef.close();
            this.translate.get('NOTIFICATION_CEDIT.EDIT_FAIL').subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
          }
        });
      }
        });
    })
  }

  viewContract() {
    const id = this.pass.id;
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.manageContractService.contractDetail({ id }).subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
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
        
   const fullName = this.viewDetailContract.assignAccountFullName || '';
const phoneNumber = this.viewDetailContract.assignAccountPhoneNumber || '';

this.editContractsForm
  .get('assignAccountFullName')
  ?.setValue(fullName && phoneNumber ? `${fullName} - ${phoneNumber}` : '');


      } 
    });
  }

  cancelEditReq() {
    if (this.dialog) {
      this.dialogRef.close();
    }
  }
}
