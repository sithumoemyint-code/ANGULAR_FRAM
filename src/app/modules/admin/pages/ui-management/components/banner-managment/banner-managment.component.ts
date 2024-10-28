import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { Validators } from 'ngx-editor';
import { cloneDeep } from 'lodash';
import { BannerService } from './banner.service';
import * as moment from 'moment';
import { AlertService } from 'src/app/modules/service/alert.service';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-banner-managment',
  templateUrl: './banner-managment.component.html',
  styleUrls: ['./banner-managment.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorComponent,
    CommonModule,
    InputComponent,
    SelectComponent,
    PermissionDirective,
    TranslateModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class BannerManagmentComponent implements OnInit {
  searchForm!: FormGroup;
  _status: any;
  currentLang = 'vi';
  _id: any;
  public section: string = '';

  selectStatus = [
    { value: '', label: 'ALL' },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVE', label: 'INACTIVE' },
  ];

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  isChecked: boolean = false;
  banners: any[] = [];

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _banner: BannerService,
    private _alert: AlertService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    this.searchForm = this.fb.group({
      title: ['', [Validators.required]],
      fromTime: [
        // moment().subtract(1, 'months').format('YYYY-MM-DD'),
        // [Validators.required],
      ],
      toTime: [
        '',
        // moment().format('YYYY-MM-DD'), [Validators.required]
      ],
      status: ['', [Validators.required]],
    });

    this.search();
  }

  search(offset = 0) {
    this.banners = [];
    this.isLoading = true;
    let search = cloneDeep(this.searchForm.value);

    if (search.status === '') delete search.status;

    search.fromTime = moment(search.fromTime).isValid()
      ? moment(search.fromTime).format('YYYY-MM-DDT00:00:00')
      : '';
    search.toTime = moment(search.toTime).isValid()
      ? moment(search.toTime).format('YYYY-MM-DDT00:00:00')
      : '';
    search.page = this.offset = offset;
    search.size = this.size;

    this._banner.searchBanner(search).subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this.isLoading = false;

          this.banners = response.result.content;
          this.totalOffset = response.result.totalPages - 1;
        } else {
          this.isLoading = false;
           this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                  this._alert.notify(failMessage, 'FAIL');
                });
        }
      },
      error: (error: any) => {
        this.isLoading = false;
         this.translate.get('NOTIFICATION_NSTATUS.STATUS_CHANGE_FAIL').subscribe((failMessage: string) => {
                  this._alert.notify(failMessage, 'FAIL');
                });
      },
    });
  }

  routeToCreatePage() {
    this.router.navigate(['/admin/ui-management/create-banner-management']);
  }

  onEditBanner(element: any) {
    this.router.navigate(['/admin/ui-management/create-banner-management'], {
      state: { data: { element } },
    });
  }

  deleteBanner(element: any) {
    this._status = 'DELETE';
    this._id = element.id;

    this.translate
      .get('CONFIRMATION_BDELTE.DELETE')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              this._confirmDeleteBanner();
            }
          });
      });
  }

  _confirmDeleteBanner() {
    let body = {
      id: this._id,
      status: this._status,
    };

    this._banner.changeBannerStatus(body).subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.translate
          .get('NOTIFICATION_BDELETE.DELETE_SUCCESS')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'SUCCESS');
          });
        this.search();
      } else {
        this.translate
          .get('NOTIFICATION_BDELETE.DELETE_FAIL')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      }
    });
  }

  onChangeStatus(element: any) {
    this._status = element.status;
    this._id = element.id;

    this.translate
      .get('CONFIRMATION_BSTATUS.STATUS')
      .subscribe((confirmationMessage: string) => {
        this._alert
          .confirm(confirmationMessage)
          .subscribe((result: boolean) => {
            if (result) {
              this._confirmChangeStatus();
            }
          });
      });
  }

  _confirmChangeStatus() {
    this._status = this._status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    let body = {
      id: this._id,
      status: this._status,
    };

    this._banner.changeBannerStatus(body).subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.translate
          .get('NOTIFICATION_BSTATUS.STATUS_SUCCESS')
          .subscribe((successMessage: string) => {
            this._alert.notify(successMessage, 'SUCCESS');
          });
        this.search();
      } else {
        this.translate
          .get('NOTIFICATION_BSTATUS.STATUS_FAIL')
          .subscribe((failMessage: string) => {
            this._alert.notify(failMessage, 'FAIL');
          });
      }
    });
  }

  reset() {
    this.searchForm.reset();
    // this.searchForm
    //   .get('fromTime')
    //   ?.setValue(moment().subtract(1, 'months').format('YYYY-MM-DD'));
    // this.searchForm.get('toTime')?.setValue(moment().format('YYYY-MM-DD'));
    this.searchForm.get('fromTime')?.setValue('');
    this.searchForm.get('toTime')?.setValue('');
    this.searchForm.get('status')?.setValue('');
    this.searchForm.get('title')?.setValue('');

    this.search();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search();
    }
  }
}
