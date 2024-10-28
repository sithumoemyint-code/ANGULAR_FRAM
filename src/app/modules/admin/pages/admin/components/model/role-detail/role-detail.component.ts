import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/modules/service/language.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
  standalone: true,
  imports: [TranslateModule, CommonModule]
})
export class RoleDetailComponent implements OnInit {
  currentLang = 'vi'

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RoleDetailComponent>,
    private languageService: LanguageService

  ) {}

  ngOnInit(): void {
       this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  close() {
    this.dialogRef.close()
  }
}
