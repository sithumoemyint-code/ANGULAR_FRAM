import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HistoryService } from './history.service';
import { cloneDeep } from 'lodash';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import { AlertService } from 'src/app/modules/service/alert.service';

@Component({
  selector: 'app-history-notification',
  templateUrl: './history-notification.component.html',
  styleUrls: ['./history-notification.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    SelectComponent,
    PaginatorComponent,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
})
export class HistoryNotificationComponent implements OnInit {
  searchForm!: FormGroup;
  data: any[] = [];

  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  detail: any;

  isChecked: boolean = false;
  loading: boolean = false;
  currentLang = 'vi';

  selectStatus = [
    { value: 'COMPLETED', label: 'Completed', labelVi: 'Hoàn thành' },
  ];

  @ViewChild('detailModal') detailModal!: TemplateRef<any>;
  private modal!: MatDialogRef<any>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _history: HistoryService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // const currentDate = this.getCurrentDate();

    this.searchForm = this.fb.group({
      input: [''],
      status: ['COMPLETED'],
      fromDate: [''],
    });

    this.getHistory();

    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  get status() {
    return this.selectStatus.map((res) => ({
      value: res.value,
      label: this.currentLang === 'en' ? res.label : res.labelVi,
    }));
  }

  getHistory(offset: number = 0) {
    this.loading = true;
    let search = cloneDeep(this.searchForm.value);
    search.page = this.offset = offset;
    search.size = this.size;

    this._history.getHistory(search).subscribe((res: any) => {
      if (res.errorCode === '000') {
        this.loading = false;
        this.data = res.result.content;
        this.totalOffset = res.totalPages - 1;
      }
    });
  }

  resetValue() {
    this.getHistory();
  }

  getCurrentDate(): string {
    const date = new Date();
    return date.toISOString().substring(0, 10);
  }

  onDetail(res: any) {
    this.detail = res;
    this.modal = this.dialog.open(this.detailModal, {
      width: '35%',
      disableClose: true,
    });
  }

  close() {
    this.modal.close();
  }
}
