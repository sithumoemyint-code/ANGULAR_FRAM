import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/service/auth.service';
import { LanguageService } from '../service/language.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from './model/password-change/password-change.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  currentLang = 'vi';
  public username: string = '';
  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '320px'));

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private _dialog: MatDialog
  ) {
    translate.setDefaultLang(this.currentLang);
  }

  ngOnInit(): void {
    this.username = this.cookieService.get('username');
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
  }

  changePassword() {
    this._dialog.open(PasswordChangeComponent, {
      disableClose: false,
    });
  }

  logOut() {
    localStorage.removeItem('language');
    this.authService.logOut();
    this.router.navigate(['login']);
  }

  switchLanguage() {
    const newLang = this.currentLang === 'vi' ? 'en' : 'vi';
    this.languageService.switchLanguage(newLang);
    this.currentLang = newLang;
  }
}
