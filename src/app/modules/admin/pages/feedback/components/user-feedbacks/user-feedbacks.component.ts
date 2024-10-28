import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { FeedbackDetailComponent } from '../model/feedback-detail/feedback-detail.component';
import { PaginationStandaloneComponent } from 'src/app/modules/custom/pagination-standalone/pagination-standalone.component';
import { UserFeedbacksService } from './user-feedbacks.service';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { AlertService } from 'src/app/modules/service/alert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { LoadingComponent } from 'src/app/modules/custom/loading/loading.component';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface SelectStatusType {
  value: string;
  label: string;
}
interface selectStatusType {
  id: string;
  email: string;
  content: string;
  status: string;
  create: string;
}

@Component({
  selector: 'app-user-feedbacks',
  templateUrl: './user-feedbacks.component.html',
  styleUrls: ['./user-feedbacks.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    PaginationStandaloneComponent,
    MatProgressSpinnerModule,
    PaginatorComponent,
    LoadingComponent,
    TranslateModule,
  ],
})
export class UserFeedbacksComponent implements OnInit {
  createForm!: FormGroup;

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;

  isLoading: boolean = false;

  public selectStatus: SelectStatusType[] = [];

  public feedbacks: selectStatusType[] = [];

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private _userFeedbacksService: UserFeedbacksService,
    private _alert: AlertService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      email: ['', Validators.email],
      status: [''],
      date: [moment().format('YYYY-MM-DD')],
    });
    this.dropdownStatus();
  }

  dropdownStatus() {
    this._userFeedbacksService.feedbackStatus().subscribe({
      next: (response: any) => {
        if (response.errorCode === '000') {
          this.selectStatus = response.result.map((res: any) => ({
            value: res,
            label: res,
          }));

          this.createForm.patchValue({
            status: response.result[0],
          });

          this.search();
        } else {
          this._alert.notify(
            response.message || `Something went wrong in status dropdown.`,
            'FAIL'
          );
        }
      },
      error: (error: any) => {
        this._alert.notify(`Something went wrong in status dropdown.`, 'FAIL');
      },
    });
  }

  search(offset: number = 0) {
    if (!this.createForm.invalid) {
      let date = this.createForm.value.date;
      if (!date.includes('T00:00:00')) date = `${date}T00:00:00`;

      let params = cloneDeep(this.createForm.value);

      params.createdDate = date;
      delete params.date;
      params.page = this.offset = offset;
      params.size = this.size;

      this.feedbacks = [];
      this.isLoading = true;

      this._userFeedbacksService.userFeedbackList(params).subscribe({
        next: (response: any) => {
          if (response.errorCode === '000') {
            this.isLoading = false;

            this.feedbacks = response.result.content.map((item: any) => ({
              id: item.id,
              email: item.email,
              content: item.content,
              status: item.status,
              create: item.createdAt,
            }));
            this.totalOffset = response.result.totalPages - 1;
          } else {
            this.isLoading = false;
            this.translate
              .get('COMMONE.SOMETHING_WRONG')
              .subscribe((successMessage: string) => {
                this._alert.notify(response.message || successMessage, 'FAIL');
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
  }

  download() {
    let date = this.createForm.value.date;
    if (!date.includes('T00:00:00')) date = `${date}T00:00:00`;
    let params = cloneDeep(this.createForm.value);

    params.createdDate = date;
    delete params.date;
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._userFeedbacksService.feedbackDownload(params).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          const blob = response.body!;
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = `feedback-excel-${date}`; // Use the extracted filename
          a.click();
          URL.revokeObjectURL(objectUrl);
          loadingRef.close();

          this.translate
            .get('DOWNLOAD_EXCEL_SUCCESS')
            .subscribe((successMessage: string) => {
              this._alert.notify(successMessage, 'SUCCESS');
            });
        } else {
          loadingRef.close();
          this.translate
            .get('COMMONE.SOMETHING_WRONG')
            .subscribe((successMessage: string) => {
              this._alert.notify(response.message || successMessage, 'FAIL');
            });
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

  reset() {
    this.createForm.reset({
      email: '',
      status: 'ALL',
      date: moment().format('YYYY-MM-DD'), // Reset with the current date
    });

    this.search();
  }

  infoDetail(item: any) {
    this._dialog.open(FeedbackDetailComponent, {
      width: '40%',
      disableClose: false,
      data: item,
    });
  }
}
