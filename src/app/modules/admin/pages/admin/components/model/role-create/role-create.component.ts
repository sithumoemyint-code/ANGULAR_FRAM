import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
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
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { TreeViewComponent } from 'src/app/modules/custom/tree-view/tree-view.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { RoleService } from '../../role/role.service';
import { LoadingComponent } from 'src/app/modules/custom/loading/loading.component';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

type BtnType = string;
type headerType = string;

type MenuItem = {
  label: string;
  status?: boolean; // Optional since it might not be present at the top level
  subPermissionCode?: string;
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss'],
  standalone: true,
  imports: [
    InputComponent,
    CommonModule,
    ReactiveFormsModule,
    TreeViewComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    LoadingComponent,
    TranslateModule,
  ],
})
export class RoleCreateComponent implements OnInit {
  btnText: BtnType = '';
  headerTitle: headerType = '';
  createRole!: FormGroup;
  accessRole: string[] = [];
  editArray: string[] = [];
  menuItem = signal<MenuItem[]>([]);
  @Output() roleCreated = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoleCreateComponent>,
    private _alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _roleService: RoleService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate
      .get(['CREATE_ADMINISTRATOR_ACCOUNT', 'CREATE'])
      .subscribe((translations: any) => {
        this.headerTitle = translations['CREATE_ADMINISTRATOR_ACCOUNT'];
        this.btnText = translations['CREATE'];
      });

    this._roleService.listPermission().subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          const result = response.result.filter(
            (item: any) => item.name !== 'ALL'
          );
          this.menuItem.set(
            result.map((res: any) => ({
              label: res.name,
              subItems: res.subPermissions.map((sub: any) => ({
                label: sub.name,
                subPermissionCode: sub.subPermissionCode,
              })),
            }))
          );
        } else {
          this._alert.notify(`Something went wrong.`, 'FAIL');
        }
      },
      error: (error: any) => {
        this._alert.notify(`Something went wrong.`, 'FAIL');
      },
    });

    this.createRole = this.fb.group({
      roleName: ['', Validators.required],
      subPermissionIds: [[]],
    });

    if (this.data !== null) {
      this.translate
        .get(['UPDATE_ADMINISTRATOR_ACCOUNT', 'UPDATE'])
        .subscribe((translations: any) => {
          this.headerTitle = translations['UPDATE_ADMINISTRATOR_ACCOUNT'];
          this.btnText = translations['UPDATE'];
        });
      this.refillData();
    }
  }

  refillData() {
    this.createRole.patchValue({
      roleName: this.data.refill.name,
    });

    this.editArray = this.data.permission_array;
  }

  removeRole(role: string) {
    if (this.accessRole.includes(role))
      this.accessRole = this.accessRole.filter((item) => item !== role);
  }

  onAccessRoleChange(updatedAccessRole: string[]) {
    this.accessRole = updatedAccessRole;
  }

  createAdminRole() {
    if (this.createRole.invalid) {
      this.createRole.markAllAsTouched();
    } else {
      const subPermissionCodes = this.accessRole.map((label: any) => {
        for (const permission of this.menuItem()) {
          const subItem = permission?.subItems?.find(
            (subItem) => subItem.label === label
          );
          if (subItem) return subItem.subPermissionCode;
        }
        return null;
      });

      forkJoin({
        firstMessage: this.translate.get('COMMONE.ARE_YOU'),
        create: this.translate.get('COMMONE.CREATE'),
        edit: this.translate.get('COMMONE.EDIT'),
        lastMessage: this.translate.get(
          'COMMONE.ADMINISTRATOR.THIS_ADMINISTRATOR'
        ),
      }).subscribe(({ firstMessage, create, edit, lastMessage }) => {
        this._alert
          .confirm(
            `${firstMessage} ${
              this.data !== null ? edit : create
            } ${lastMessage}`
          )
          .subscribe((result: boolean) => {
            if (result) {
              this.createRole.patchValue({
                subPermissionIds:
                  this.accessRole.length <= 0 ? ['ALL'] : subPermissionCodes,
              });

              if (this.data !== null)
                this.editRoleApi(
                  this.data.refill.roleId,
                  this.createRole.value
                );
              else this.createRoleApi(this.createRole.value);
            }
          });
      });
    }
  }

  createRoleApi(data: any) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._roleService.createRole(data).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          loadingRef.close();

          forkJoin({
            firstMessage: this.translate.get('COMMONE.YOU_CREATED'),
            create: this.translate.get('COMMONE.CREATE'),
            edit: this.translate.get('COMMONE.EDIT'),
            lastMessage: this.translate.get('COMMONE.SUCCESSFULLY'),
          }).subscribe(({ firstMessage, create, edit, lastMessage }) => {
            this._alert.notify(
              `${firstMessage} ${
                this.data !== null ? edit : create
              } ${lastMessage}`,
              'SUCCESS'
            );
          });
          this.dialogRef.close();

          this.roleCreated.emit('success');
        } else if (response.errorCode === '214') {
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

  editRoleApi(roleId: any, data: any) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._roleService.editRole(roleId, data).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          loadingRef.close();
          forkJoin({
            firstMessage: this.translate.get('COMMONE.YOU_CREATED'),
            create: this.translate.get('COMMONE.CREATE'),
            edit: this.translate.get('COMMONE.EDIT'),
            lastMessage: this.translate.get('COMMONE.SUCCESSFULLY'),
          }).subscribe(({ firstMessage, create, edit, lastMessage }) => {
            this._alert.notify(
              `${firstMessage} ${
                this.data !== null ? edit : create
              } ${lastMessage}`,
              'SUCCESS'
            );
          });
          this.dialogRef.close();
          this.roleCreated.emit('success');
        } else if (response.errorCode === '214') {
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

  close() {
    this.dialogRef.close();
  }
}
