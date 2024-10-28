import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { AdminAccountService } from '../../admin-account/admin-account.service';
import { RoleService } from '../../role/role.service';
import { LoadingComponent } from 'src/app/modules/custom/loading/loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

type BtnType = string;
type headerType = string;

interface SelectRoleType {
  value: string;
  label: string;
}

@Component({
  selector: 'app-adminstator-account',
  templateUrl: './adminstator-account.component.html',
  styleUrls: ['./adminstator-account.component.scss'],
  standalone: true,
  imports: [
    InputComponent,
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    LoadingComponent,
    TranslateModule,
  ],
})
export class AdminstatorAccountComponent implements OnInit {
  createAdminAcc!: FormGroup;
  btnText: BtnType = '';
  headerTitle: headerType = '';
  @Output() adminAccountCreated = new EventEmitter<string>();

  public selectRole: SelectRoleType[] = [];

  public getRoleId = '';

  constructor(
    private dialogRef: MatDialogRef<AdminstatorAccountComponent>,
    private fb: FormBuilder,
    private _alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _adminAccountService: AdminAccountService,
    private _RoleService: RoleService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate
      .get(['CREATE_ADMINISTRATOR_ACCOUNT', 'CREATE'])
      .subscribe((translations: any) => {
        this.headerTitle = translations['CREATE_ADMINISTRATOR_ACCOUNT'];
        this.btnText = translations['CREATE'];
      });

    this._RoleService.listRole().subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this.selectRole = response.result.map((item: any) => ({
            value: item.roleId,
            label: item.name,
          }));
        } else {
          this.translate
            .get('COMMONE.ROLE_DROPDOWN')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'FAIL');
            });
        }
      },
      error: (error: any) => {
        this.translate
          .get('COMMONE.ROLE_DROPDOWN')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'FAIL');
          });
      },
    });
    this.createAdminAcc = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      gender: ['MALE'],
    });

    if (this.data !== null) {
      this.btnText = 'Update';
      this.headerTitle = 'Update Administrator Account';
      this.refillData();
    }
  }

  refillData() {
    this.createAdminAcc.patchValue({
      fullName: this.data.refill.name,
      phoneNumber: '0992388282',
      email: this.data.refill.email,
      roleId: this.data.refill.role,
      gender: 'female',
    });
  }

  createAdminstrator() {
    if (this.createAdminAcc.invalid) {
      this.createAdminAcc.markAllAsTouched();
    } else {
      forkJoin({
        firstMessage: this.translate.get('COMMONE.ARE_YOU'),
        create: this.translate.get('COMMONE.CREATE'),
        edit: this.translate.get('COMMONE.EDIT'),
        lastMessage: this.translate.get('COMMONE.ADMINISTRATOR.THIS_ACCOUNT'),
        secondMessage: this.translate.get('COMMONE.YOU_CREATED_ACCOUNT'),
        secondLastMessage: this.translate.get('COMMONE.SUCCESSFULLY'),
      }).subscribe(
        ({
          firstMessage,
          create,
          edit,
          lastMessage,
          secondMessage,
          secondLastMessage,
        }) => {
          this._alert
            .confirm(
              `${firstMessage} ${
                this.data !== null ? edit : create
              } ${lastMessage}`
            )
            .subscribe((result: boolean) => {
              if (result) {
                const loadingRef = this.dialog.open(ApiLoadingComponent, {
                  disableClose: true,
                });

                this._adminAccountService
                  .accountCreate(this.createAdminAcc.value)
                  .subscribe({
                    next: (response: any) => {
                      if (response.errorCode === '000') {
                        loadingRef.close();
                        this._alert.notify(
                          `${secondMessage} ${
                            this.data !== null ? edit : create
                          }  ${secondLastMessage}`,
                          'SUCCESS'
                        );
                        this.dialogRef.close();
                        this.adminAccountCreated.emit('success');
                      } else if (response.errorCode === '216') {
                        loadingRef.close();
                        this._alert.notify(response.message, 'FAIL');
                      } else {
                        loadingRef.close();
                        this._alert.notify(
                          response.message || `Something went wrong.`,
                          'FAIL'
                        );
                      }
                    },
                    error: (error: any) => {
                      loadingRef.close();
                      this.translate
                        .get('COMMONE.SOMETHING_WRONG')
                        .subscribe((successMessage: string) => {
                          this._alert.notify(successMessage, 'FAIL');
                        });
                    },
                  });
              }
            });
        }
      );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
