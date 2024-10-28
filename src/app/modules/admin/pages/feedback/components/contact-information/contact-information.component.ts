import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContactInformationCreateComponent } from '../model/contact-information-create/contact-information-create.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmComponent } from 'src/app/modules/custom/model/confirm/confirm.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ContactInformationService } from './contact-information.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ContactDataType {
  id: string;
  name: string;
  iconUrl: string;
  route: string;
}

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactInformationCreateComponent,
    MatIconModule,
    ConfirmComponent,
    MatProgressSpinnerModule,
    PaginatorComponent,
    PermissionDirective,
    TranslateModule,
  ],
})
export class ContactInformationComponent implements OnInit {
  @ViewChild('createModal') createModal!: TemplateRef<any>;
  isLoading: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;

  public contactData: ContactDataType[] = [];

  constructor(
    private dialog: MatDialog,
    private _alert: AlertService,
    private _contactInformationService: ContactInformationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.contactInfo();
  }

  contactInfo(offset: number = 0) {
    let page = (this.offset = offset);
    let size = this.size;

    let params = {
      page,
      size,
    };
    this.contactData = [];
    this.isLoading = true;

    this._contactInformationService.contactList(params).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this.isLoading = false;
          this.contactData = response.result.content.map((item: any) => ({
            id: item.id,
            name: item.name,
            iconUrl: item.iconUrl,
            route: item.route,
          }));
          this.totalOffset = response.result.totalPages - 1;
        } else {
          this.isLoading = false;
          this.translate
            .get('COMMONE.SOMETHING_WRONG')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'FAIL');
            });
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.translate
          .get('COMMONE.SOMETHING_WRONG')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'FAIL');
          });
      },
    });
  }

  openCreate() {
    const dialogRef = this.dialog.open(ContactInformationCreateComponent, {
      height: '60%',
      width: '30%',
      disableClose: false,
    });

    dialogRef.componentInstance.contactInformationCreated.subscribe(
      (message: string) => {
        if (message === 'success') this.contactInfo();
      }
    );
  }

  edit(item: any) {
    this.dialog.open(ContactInformationCreateComponent, {
      width: '30%',
      disableClose: false,
      data: { refill: item },
    });
  }

  delete(id: string) {
    this.translate
      .get('COMMONE.SURE_DELETE_CONTACT')
      .subscribe((message: string) => {
        this._alert.confirm(message).subscribe((result: boolean) => {
          if (result) {
            const loadingRef = this.dialog.open(ApiLoadingComponent, {
              disableClose: true,
            });
            this._contactInformationService.deleteContact(id).subscribe({
              next: (response: any) => {
                if (response.errorCode === '000') {
                  loadingRef.close();
                  this.translate
                    .get('COMMONE.DELETE_CONTACT_SUCCESS')
                    .subscribe((message: string) => {
                      this._alert.notify(message, 'SUCCESS');
                    });

                  this.contactInfo(this.offset);
                } else {
                  loadingRef.close();
                  this._alert.notify(response.message, 'FAIL');
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
      });
  }
}
