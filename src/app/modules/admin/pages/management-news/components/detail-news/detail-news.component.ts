import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { ManagementNewsService } from '../../management-news.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.component.html',
  styleUrls: ['./detail-news.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule]
})
export class DetailNewsComponent implements OnInit{
  pass: any
  apiData: any 
  currentLang = 'vi'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: MatDialog,
    private _manageNewsService: ManagementNewsService,
    private languageService: LanguageService,
  private dialogRef: MatDialogRef<DetailNewsComponent>,
  
      

  ) {
  this.pass = data.dataPass;
    
  }
  ngOnInit(): void {
    this.languageService.currentLang$.subscribe(lang => {
    this.currentLang = lang;      
  });
    this.detailNews()
  }

  detailNews() {
      const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true
    })
    let toFetchData = this.pass.id
    this._manageNewsService.newsDetail({id:toFetchData}).subscribe((data:any) => {
      if( data.errorCode === '000'){
        loadingRef.close()
        this.apiData = data.result;
        console.log(this.apiData, 'this is for new detail');
        
      }
    })
  }

  close() {
    this.dialogRef.close()
  }
}
