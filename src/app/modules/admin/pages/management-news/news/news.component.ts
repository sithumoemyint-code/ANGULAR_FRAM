import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { EditModalComponent } from '../components/edit-modal/edit-modal.component';
import { InputComponent } from '../../../../custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { ManagementNewsService } from '../management-news.service';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { LoadingComponent } from 'src/app/modules/custom/loading/loading.component';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PermissionDirective } from '../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import { DetailNewsComponent } from '../components/detail-news/detail-news.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    CreatePostComponent,
    EditModalComponent,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    LoadingComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    PermissionDirective,
    TranslateModule,
    DetailNewsComponent,
  ],
})
export class NewsComponent implements OnInit {
  private modal!: MatDialogRef<any>;
  currentLang = 'vi';
  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  isLoading: boolean = false;

  searchForm!: FormGroup;

  searchNewsData: any[] = [];
status: { value: string, label: string }[] = [];

  // status = [
  //   { value: 'ALL', label: 'All' },
  //   { value: 'ACTIVE', label: 'Active' },
  //   { value: 'INACTIVE', label: 'Inactive' },
  // ];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _manageNewsService: ManagementNewsService,
    private _alert: AlertService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      title: [''],
      fromTime: [''],
      toTime: [''],
      status: ['ALL'],
    });
    this.searchNews();
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
     this.initializeSelectStatus();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSelectStatus();
    });
  }
  initializeSelectStatus(): void {
    this.status = [
      { value: 'ALL', label: this.translate.instant('STATUS_ALL') },
      { value: 'ACTIVE', label: this.translate.instant('STATUS_ACTIVE') },
      { value: 'INACTIVE', label: this.translate.instant('STATUS_INACTIVE') },
    ];
  }
  onToggle(id: string, data: any): void {
    this.translate
      .get('CONFIRMATION_NSTATUS.CHANGE_STATUS')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              const newStatus =
                data.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

              this._manageNewsService
                .changeStatus({ id, status: newStatus })
                .subscribe((response: any) => {
                  if (response.errorCode === '000') {
                    data.status = newStatus;
                    this.searchNews();

                    this.translate
                      .get('NOTIFICATION_NSTATUS.STATUS_CHANGED_SUCCESS')
                      .subscribe((successMessage: string) => {
                        this._alert.notify(successMessage, 'SUCCESS');
                      });
                  } else {
                    this.translate
                      .get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL')
                      .subscribe((failMessage: string) => {
                        this._alert.notify(failMessage, 'FAIL');
                      });
                  }
                });
            }
          });
      });
  }

  onCreate() {
    this.modal = this.dialog.open(CreatePostComponent, {
      height: '90%',
      width: '843px',
      disableClose: false,
    });
    this.modal.componentInstance.newsPostCreated.subscribe(
      (message: string) => {
        if (message === 'success') this.searchNews();
      }
    );
  }

  onEdit(passData: any) {
    this.modal = this.dialog.open(EditModalComponent, {
      height: '90%',
      width: '843px',
      disableClose: false,
      data: { parentDialogRef: this.modal, dataPass: passData },
    });
    this.modal.componentInstance.editNewsCreated.subscribe(
      (message: string) => {
        if (message === 'success') this.searchNews();
      }
    );
  }

  onDetail(id: any) {
    this.modal = this.dialog.open(DetailNewsComponent, {
      height: '90%',
      width: '843px',
      disableClose: false,
      data: { parentDialogRef: this.modal, dataPass: id },
    });
  }

  resetSearchForm() {
    this.searchForm.reset({
      title: '',
      fromTime: '',
      toTime: '',
      status: 'ALL',
    });
    this.searchNews();
  }

  onDelete(id: string): void {
    this.translate
      .get('CONFIRMATION_NDELTE.DELETE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true,
              });
              const newStatus = 'DELETE';
              this._manageNewsService
                .changeStatus({ id, status: newStatus })
                .subscribe((response: any) => {
                  if (response.errorCode === '000') {
                    loadingRef.close();
                    response.status = newStatus;
                    this.translate
                      .get('NOTIFICATION_NDELETE.DELETE_SUCCESS')
                      .subscribe((successMessage: string) => {
                        this._alert.notify(successMessage, 'SUCCESS');
                      });
                    this.searchNews();
                  } else {
                    loadingRef.close();
                    this.translate
                      .get('NOTIFICATION_NDELETE.DELETE_FAIL')
                      .subscribe((failMessage: string) => {
                        this._alert.notify(failMessage, 'FAIL');
                      });
                  }
                });
            }
          });
      });
  }

  searchNews(offset: number = 0) {
    if (!this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      let search = cloneDeep(this.searchForm.value);
      search.page = this.offset = offset;
      search.size = this.size;
      if (search.fromTime) {
        search.fromTime = moment(search.fromTime).format('YYYY-MM-DDT00:00:00');
      }
      if (search.toTime) {
        search.toTime = moment(search.toTime).format('YYYY-MM-DDT23:59:59');
      }
      if (search.status === 'ALL') {
        delete search.status;
      }

      this.isLoading = true;
      this._manageNewsService.searchNews(search).subscribe((data: any) => {
        if (data.errorCode === '000') {
          this.isLoading = false;
          this.searchNewsData = data.result.content;
          this.totalOffset = data.result.totalPages - 1;
        } else {
          this.isLoading = false;
          this.translate
            .get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL')
            .subscribe((failMessage: string) => {
              this._alert.notify(failMessage, 'FAIL');
            });
        }
      });
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchNews();
    }
  }
}
