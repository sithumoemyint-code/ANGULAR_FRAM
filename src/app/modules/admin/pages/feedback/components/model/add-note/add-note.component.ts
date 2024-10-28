import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextAreaComponent } from 'src/app/modules/custom/text-area/text-area.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { ConfirmComponent } from 'src/app/modules/custom/model/confirm/confirm.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { UserFeedbacksService } from '../../user-feedbacks/user-feedbacks.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
  standalone: true,
  imports: [
    TextAreaComponent,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    InputComponent,
    ConfirmComponent,
    TranslateModule,
  ],
})
export class AddNoteComponent implements OnInit {
  noteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNoteComponent>,
    private dialog: MatDialog,
    private _alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _userFeedbacksService: UserFeedbacksService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      note: ['', [Validators.required]],
    });
  }

  create() {
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
    } else {
      this.dialogRef.close();
      this.translate
        .get('COMMONE.SURE_FEEDBACK')
        .subscribe((message: string) => {
          this._alert.confirm(message).subscribe((result: boolean) => {
            if (result) {
              const loadingRef = this.dialog.open(ApiLoadingComponent, {
                disableClose: true,
              });

              this._userFeedbacksService
                .feedbackNote(this.data, this.noteForm.value)
                .subscribe({
                  next: (response: any) => {
                    if (response.errorCode === '000') {
                      loadingRef.close();
                      this.translate
                        .get('COMMONE.FEEDBACK_SUCCESSFULLY')
                        .subscribe((successMessage: string) => {
                          this._alert.notify(successMessage, 'SUCCESS');
                        });
                    } else {
                      loadingRef.close();
                      this.translate
                        .get('COMMONE.SOMETHING_WRONG')
                        .subscribe((successMessage: string) => {
                          this._alert.notify(successMessage, 'FAIL');
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
          });
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
