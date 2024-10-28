import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { RichTextStandaloneComponent } from 'src/app/modules/custom/rich-text-standalone/rich-text-standalone.component';
import { NotificationService } from './notification.service';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { cloneDeep } from 'lodash';
import { PermissionDirective } from '../../../permission.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TextAreaComponent } from 'src/app/modules/custom/text-area/text-area.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ReactiveFormsModule,
    RichTextStandaloneComponent,
    InputComponent,
    SelectComponent,
    MatProgressSpinnerModule,
    PermissionDirective,
    TranslateModule,
    TextAreaComponent,
  ],
})
export class NotificationChildComponent implements OnInit {
  @ViewChild('detailModal') detailModal!: TemplateRef<any>;
  @ViewChild('createModal') createModal!: TemplateRef<any>;
  @ViewChild('updateModal') updateModal!: TemplateRef<any>;
  @ViewChild('fileUploadfront') fileUploadfront!: ElementRef<any>;

  dialogRef!: MatDialogRef<any>;
  currentLang = 'vi';
  campaign: any[] = [];
  offset: number = 0;
  size: number = 20;
  totalOffset: number = 0;
  optionType = ['System', 'Promotion', 'Finish Contract', 'Renew Contract'];
  languages = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Vietnamese' },
  ];
  createForm!: FormGroup;
  searchForm!: FormGroup;
  campaignOnly!: FormGroup;
  text!: string;
  selectedRouteType: string = '';
  newUsername: string = '';
  users: string[] = [];
  add: boolean = false;
  button: boolean = true;
  frontImgs: { fileFront: File }[] = [];
  editImgs: any[] = [];
  uploadFile: any[] = [];
  statusValue: any[] = [];
  dropDownStatus = [
    { value: 'ALL', label: 'All', labelVi: 'Tất cả' },
    {
      value: 'PREPARING_DATA',
      label: 'PREPARING_DATA',
      labelVi: 'Chuẩn bị dữ liệu',
    },
    { value: 'PENDING', label: 'PENDING', labelVi: 'Đang chờ' },
    { value: 'RUNNING', label: 'RUNNING', labelVi: 'Đang chạy' },
    { value: 'COMPLETED', label: 'COMPLETED', labelVi: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'CANCELLED', labelVi: 'Hủy' },
  ];
  id: any;
  icon: any[] = [];
  filterIcon: any;
  campaignId: any;
  loading: boolean = false;

  hours: { value: string; label: string }[] = [];
  minutes: { value: string; label: string }[] = [];
  periods: any[] = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  selectedHour: string = '00';
  selectedMinute: string = '00';
  selectedPeriod: string = 'PM';
  routeType: any[] = [];
  tomorrow: string = '';

  cronExpression: string | null = null;
  _selectedLanguage: any = 'vi';
  _selectedSecondColumnLanguage: any = 'en';
  secondColumnLanguages: any = [];
  selectLang = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Vietnamese' },
  ];

  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _noti: NotificationService,
    private _alert: AlertService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.tomorrow = today.toISOString().split('T')[0];

    this.hours = Array.from({ length: 12 }, (_, i) => {
      const hourString = this.formatWithLeadingZero(i + 1);
      return { value: hourString, label: hourString };
    });
    this.hours.unshift({ value: '00', label: '00' });

    this.minutes = Array.from({ length: 60 }, (_, i) => {
      const minuteString = this.formatWithLeadingZero(i);
      return { value: minuteString, label: minuteString };
    });
  }

  ngOnInit(): void {
    this.getCampaign();
    // this.getStatus();

    this.searchForm = this.fb.group({
      title: [''],
      status: ['ALL'],
      fromDate: [''],
      toDate: [''],
    });

    this.createForm = this.fb.group({
      type: ['', Validators.required],
      language: ['vi'],
      secondLanguage: ['en'],
      titleEn: ['', Validators.required],
      titleVi: ['', Validators.required],
      contentEn: ['', Validators.required],
      contentVi: ['', Validators.required],
      routeType: ['NONE', Validators.required],
      routeTo: '',
      hour: ['00', Validators.required],
      minute: ['00', Validators.required],
      period: ['PM', Validators.required],
      date: [null, Validators.required],
    });

    this.campaignOnly = this.fb.group({
      campaignOnly: true,
    });

    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  resetSearch() {
    this.searchForm.reset({
      title: '',
      status: 'ALL',
      fromDate: '',
      toDate: '',
    });
    this.getCampaign();
  }

  get dropDownValue() {
    return this.dropDownStatus.map((data) => ({
      value: data.value,
      label: this.currentLang === 'en' ? data.label : data.labelVi,
    }));
  }

  getIcon() {
    let params = this.campaignOnly.value;
    this._noti.getIconForNoti(params).subscribe((data: any) => {
      this.icon = data.result.map((status: any) => ({
        value: status.id,
        label: status.name[this.currentLang] || status.name.vi,
      }));
    });
  }

  changeLanguage() {
    this._selectedLanguage = this.createForm.get('language')?.value;
    const secondLanguageValue = this._selectedLanguage === 'en' ? 'vi' : 'en';
    const secondLanguageLabel =
      this._selectedLanguage === 'en' ? 'Vietnamese' : 'English';
    this.createForm.controls?.['secondLanguage'].setValue(secondLanguageValue);
    this._selectedSecondColumnLanguage = secondLanguageValue;
    this.secondColumnLanguages = [
      { value: secondLanguageValue, label: secondLanguageLabel },
    ];
  }

  // getStatus() {
  //   this._noti.getStatus().subscribe((data: any) => {
  //     this.statusValue = data.result.map((status: string) => ({
  //       value: status,
  //       label: status,
  //     }));
  //   });
  // }

  downloadFile(id: string) {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._noti.exportExcel(id).subscribe(
      (response: Blob) => {
        loadingRef.close();
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = `file_${id}.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_NOTI_CREATE.FAIL')
          .subscribe((message: string) => {
            this._alert.notify(message, 'FAIL');
          });
      }
    );
  }

  formatExcel() {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._noti.formatExcelFile().subscribe(
      (res: Blob) => {
        loadingRef.close();
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(res);
        a.href = objectUrl;
        a.download = `Format.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_NOTI_CREATE.FAIL')
          .subscribe((message: string) => {
            this._alert.notify(message, 'FAIL');
          });
      }
    );
  }

  getCampaign(offset: number = 0) {
    this.loading = true;
    let params = this.searchForm?.value ? cloneDeep(this.searchForm.value) : {};

    params.page = this.offset = offset;
    params.size = this.size;

    this._noti.getCampaign(params).subscribe((data: any) => {
      if (data.errorCode === '000') {
        this.loading = false;
        this.campaign = data.result.content;
        if (data.totalPages !== undefined) {
          this.totalOffset = data.totalPages - 1;
        }
      }
    });
  }

  openDetail(element: any) {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    this.dialogRef = this._dialog.open(this.detailModal, {
      width: '50%',
      height: '90%',
      disableClose: true,
    });

    this._noti.detailCampaign(element).subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
        this.id = data.result;
      }
    });
  }

  delete(element: any) {
    this.translate
      .get('NOTIFICATION_NOTI_DELETE.CONFIRM_DELETE')
      .subscribe((message: string) => {
        this._alert.confirm(message).subscribe((Response) => {
          this._onDelete(element);
        });
      });
  }

  _onDelete(element: any) {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    this._noti.deleteCampaign(element).subscribe((data: any) => {
      if (data.errorCode === '000') {
        loadingRef.close();
        this.translate
          .get('NOTIFICATION_NOTI_DELETE.SUCCESS_DELETE')
          .subscribe((message: string) => {
            this._alert.notify(message, 'SUCCESS');
            this.getCampaign();
          });
      } else if (data.errorCode === '100') {
        this.translate
          .get('NOTIFICATION_NOTI_DELETE.RUNNING_ERROR')
          .subscribe((message: string) => {
            loadingRef.close();
            this._alert.notify(message, 'FAIL');
          });
      } else {
        this.translate
          .get('NOTIFICATION_NOTI_DELETE.FAIL')
          .subscribe((message: string) => {
            loadingRef.close();
            this._alert.notify(message, 'FAIL');
          });
      }
    });
  }

  getRouteType() {
    this._noti.getRoute().subscribe((data: any) => {
      this.routeType = data.result.map((res: string) => ({
        value: res,
        label: res,
      }));
    });
  }

  openCreateModal() {
    this.getRouteType();
    this.resetValue();
    this.getIcon();
    this.dialogRef = this._dialog.open(this.createModal, {
      width: '70%',
      height: '90%',
      disableClose: false,
    });
  }

  extractTimeDetails(dateTime: string) {
    const [date, time] = dateTime.split(' ');
    const [hour, minute] = time.split(':').slice(0, 2);

    let hourNum = parseInt(hour, 10);
    let period = 'AM';

    if (hourNum >= 12) {
      period = 'PM';
      if (hourNum > 12) {
        hourNum -= 12;
      }
    } else if (hourNum === 0) {
      hourNum = 12;
    }

    return {
      hour: this.formatWithLeadingZero(hourNum),
      minute: this.formatWithLeadingZero(parseInt(minute, 10)),
      period,
    };
  }

  openUpdate(element: any) {
    this.getRouteType();
    this.getIcon();
    this.campaignId = element.id;
    this._noti.getIcon().subscribe((data: any) => {
      this.filterIcon = data.result.filter(
        (item: any) => item.messageType?.type === element.messageType.type
      );
      const messageTypeName =
        this.filterIcon.length > 0 ? this.filterIcon[0].id : '';

      this.createForm.patchValue({
        type: messageTypeName || '',
        language: 'en',
        secondLanguage: 'vi',
        titleEn: element.title.en || '',
        titleVi: element.title.vi || '',
        contentEn: element.content.en || '',
        contentVi: element.content.vi || '',
        routeType: element.routeType || '',
        routeTo: element.routeTo || '',
        hour: timeDetails.hour,
        minute: timeDetails.minute,
        period: timeDetails.period,
        date: element.startAt.split(' ')[0],
      });
    });

    const timeDetails = this.extractTimeDetails(element.startAt);

    this.dialogRef = this._dialog.open(this.updateModal, {
      width: '70%',
      height: '90%',
      disableClose: true,
    });

    this.editImgs = element.attachments || [];
  }

  update() {
    this.translate
      .get('NOTIFICATION_NOTI_UPDATE.CONFIRM_UPDATE')
      .subscribe((message: string) => {
        this._alert.confirm(message).subscribe((Response) => {
          this._onUpdate();
          this.closeDialog();
        });
      });
  }

  _onUpdate() {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    const { date, hour, minute, period } = this.createForm.value;

    const selectedDate = date ? new Date(date) : null;

    const formattedHour = this.convertTo24Hour(hour, period);
    const formattedMinute = this.formatWithLeadingZero(parseInt(minute, 10));

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = this.formatWithLeadingZero(selectedDate.getMonth() + 1);
      const day = this.formatWithLeadingZero(selectedDate.getDate());

      const startAt = `${year}-${month}-${day} ${formattedHour}:${formattedMinute}:00`;

      const formData = new FormData();
      const title = {
        en: this.createForm.get('titleEn')?.value,
        vi: this.createForm.get('titleVi')?.value,
      };

      const content = {
        en: this.createForm.get('contentEn')?.value,
        vi: this.createForm.get('contentVi')?.value,
      };

      formData.append('campaignId', this.campaignId);
      formData.append('iconId', this.createForm.get('type')?.value);
      formData.append('title', JSON.stringify(title));
      formData.append('content', JSON.stringify(content));
      formData.append('routeType', this.createForm.get('routeType')?.value);
      formData.append('routeTo', this.createForm.get('routeTo')?.value);
      formData.append('startAt', startAt);

      this.frontImgs.forEach((img) => {
        formData.append('targets', img.fileFront);
      });

      this._noti.updateCampaign(formData).subscribe((res: any) => {
        if (res.errorCode === '000') {
          this.translate
            .get('NOTIFICATION_NOTI_UPDATE.SUCCESS_UPDATE')
            .subscribe((message: string) => {
              loadingRef.close();
              this._alert.notify(message, 'SUCCESS');
              this.getCampaign();
            });
        } else {
          this.translate
            .get('NOTIFICATION_NOTI_UPDATE.FAIL')
            .subscribe((message: string) => {
              loadingRef.close();
              this._alert.notify(res.message || message, 'FAIL');
              this.getCampaign();
            });
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onRouteTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.selectedRouteType = target.value;
    }
  }

  addButton() {
    this.add = true;
    this.button = false;
  }

  removeFileFront() {
    this.uploadFile = [];
    this.frontImgs = [];
  }

  removeSingleFileFront(index: number) {
    this.frontImgs.splice(index, 1);
    this.uploadFile.splice(index, 1);
  }

  removeSingleFileEdit(index: number) {
    this.editImgs.splice(index, 1);
  }

  onChangeFrontImg(event: any) {
    let files = event.target.files;

    if (files.length > 0) {
      let newFiles = [];

      for (let i = 0; i < files.length; i++) {
        let fileFront = files[i];
        let fileExtension = fileFront.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'xls' || fileExtension === 'xlsx') {
          newFiles.push({ fileFront });
        } else {
          this.translate
            .get('NOTI_EXCEL.EXCEL_FILE_ALLOW')
            .subscribe((message: string) => {
              alert(message);
            });
        }
      }

      this.frontImgs = [...this.frontImgs, ...newFiles];

      this.uploadFile = [...this.uploadFile, ...newFiles];
    }
  }

  create() {
    const { hour, minute, date } = this.createForm.value;
    const selectedDate = date ? new Date(date) : null;
    const dayOfMonth = date ? new Date(date).getDate() : '*';
    const month = selectedDate ? selectedDate.getMonth() + 1 : '*';
    const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;

    this.translate
      .get('NOTIFICATION_NOTI_CREATE.CONFIRM_CREATE')
      .subscribe((message: string) => {
        this._alert.confirm(message).subscribe((Response) => {
          this._onCreate();
          this.dialogRef.close();
        });
      });
  }

  _onCreate() {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    const {
      date,
      hour,
      minute,
      period,
      titleEn,
      titleVi,
      contentEn,
      contentVi,
      type,
      routeType,
      routeTo,
    } = this.createForm.value;
    const selectedDate = date ? new Date(date) : null;

    if (!selectedDate) return;

    const startAt = this.buildStartAt(selectedDate, hour, minute, period);
    const formData = this.buildFormData(
      titleEn,
      titleVi,
      contentEn,
      contentVi,
      type,
      routeType,
      routeTo,
      startAt
    );

    if (this.frontImgs.length > 0) {
      this.frontImgs.forEach((img) =>
        formData.append('targets', img.fileFront)
      );
    } else {
      formData.append('targets', '');
    }

    this._noti.createCampaign(formData).subscribe((res: any) => {
      const isSuccess = res.errorCode === '000';
      const messageKey = isSuccess
        ? 'NOTIFICATION_NOTI_CREATE.SUCCESS_CREATE'
        : 'NOTIFICATION_NOTI_CREATE.FAIL';

      this.translate.get(messageKey).subscribe((message: string) => {
        loadingRef.close();
        const alertType = isSuccess ? 'SUCCESS' : 'FAIL';
        this._alert.notify(message, alertType);
        this.getCampaign();
        this.closeCreate();
      });
    });
  }

  buildStartAt(
    date: Date,
    hour: string,
    minute: string,
    period: string
  ): string {
    const year = date.getFullYear();
    const month = this.formatWithLeadingZero(date.getMonth() + 1);
    const day = this.formatWithLeadingZero(date.getDate());
    const formattedHour = this.convertTo24Hour(hour, period);
    const formattedMinute = this.formatWithLeadingZero(parseInt(minute, 10));

    return `${year}-${month}-${day} ${formattedHour}:${formattedMinute}:00`;
  }

  buildFormData(
    titleEn: string,
    titleVi: string,
    contentEn: string,
    contentVi: string,
    type: string,
    routeType: string,
    routeTo: string,
    startAt: string
  ): FormData {
    const formData = new FormData();

    const title = {
      en: titleEn,
      vi: titleVi,
    };

    const content = {
      en: contentEn,
      vi: contentVi,
    };

    formData.append('iconId', type);
    formData.append('title', JSON.stringify(title));
    formData.append('content', JSON.stringify(content));
    formData.append('routeType', routeType);
    formData.append('routeTo', routeTo);
    formData.append('startAt', startAt);

    return formData;
  }

  resetValue() {
    this.createForm.reset({
      type: '',
      language: 'vi',
      secondLanguage: 'en',
      titleEn: '',
      titleVi: '',
      contentEn: '',
      contentVi: '',
      routeType: 'NONE',
      routeTo: '',
      target: '',
      hour: '00',
      minute: '00',
      period: 'PM',
      date: null,
    });
  }

  closeCreate() {
    this.dialogRef.close();
    this.resetValue();
    this.icon = [];
    this.routeType = [];
    this.removeFileFront();
    this.add = false;
    this.button = true;
  }

  formatWithLeadingZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  convertTo24Hour(hour: string, period: string): string {
    let hourNum = parseInt(hour, 10);
    if (period === 'PM' && hourNum < 12) {
      hourNum += 12;
    }
    if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }
    return this.formatWithLeadingZero(hourNum);
  }
}
