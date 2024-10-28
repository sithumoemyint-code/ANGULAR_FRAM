import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RoleDetailComponent } from '../model/role-detail/role-detail.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { RoleCreateComponent } from '../model/role-create/role-create.component';
import { RoleService } from './role.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    PermissionDirective,
    TranslateModule,
  ],
})
export class RoleComponent implements OnInit {
  public roleData: any = [];
  currentLang = 'vi';
  constructor(
    private _dialog: MatDialog,
    private _alert: AlertService,
    private _RoleService: RoleService,
    private dialog: MatDialog,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    this.getRole();
  }

  open() {
    const dialogRef = this._dialog.open(RoleCreateComponent, {
      height: '400px',
      width: '700px',
      disableClose: false,
    });

    dialogRef.componentInstance.roleCreated.subscribe((message: string) => {
      if (message === 'success') this.getRole();
    });
  }

  getRole() {
    this._RoleService.listRole().subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') this.roleData = response.result;
        else
          this._alert.notify(
            response.message || `Something went wrong.`,
            'FAIL'
          );
      },
      error: (error: any) => {
        this._alert.notify(`Something went wrong.`, 'FAIL');
      },
    });
  }

  info(item: any) {
    this._dialog.open(RoleDetailComponent, {
      height: 'auto',
      width: '680px',
      disableClose: false,
      data: item,
    });
  }

  edit(item: any) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._RoleService.detailRole(item.roleId).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          const res = response.result.subPermissions.map((res: any) => ({
            label: res.name,
          }));
          loadingRef.close();
          const dialogRef = this._dialog.open(RoleCreateComponent, {
            width: '700px',
            height: '400px',
            disableClose: false,
            data: { refill: item, permission_array: res },
          });
          dialogRef.componentInstance.roleCreated.subscribe(
            (message: string) => {
              if (message === 'success') this.getRole();
            }
          );
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
        this._alert.notify(`Something went wrong.`, 'FAIL');
      },
    });
  }

  delete(roleId: string) {
    this.translate.get('COMMONE.DELETE_ROLE').subscribe((message: string) => {
      this._alert.confirm(message).subscribe((result: boolean) => {
        if (result) {
          const loadingRef = this.dialog.open(ApiLoadingComponent, {
            disableClose: true,
          });
          this._RoleService.deleteRole(roleId).subscribe({
            next: (response: any) => {
              if (response.errorCode === '000') {
                loadingRef.close();
                this.translate
                  .get('COMMONE.DELETE_ROLE_SUCCESSFULLY')
                  .subscribe((message: string) => {
                    this._alert.notify(message, 'SUCCESS');
                  });

                this.roleData = this.roleData.filter(
                  (item: any) => item.roleId !== roleId
                );
              } else if (response.errorCode === '236') {
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
              this._alert.notify(`Something went wrong.`, 'FAIL');
            },
          });
        }
      });
    });
  }
}
