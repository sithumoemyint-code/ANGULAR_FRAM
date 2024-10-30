import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BrowserDetectionService } from './browser-detection.service';
import { LoginServiceService } from './login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  otp!: FormGroup;
  loading: boolean = false;
  browser!: string;
  showErrorMessage!: string;
  currentLang = 'en';
  isRequestedOtp: boolean = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private browserDetectionService: BrowserDetectionService,
    private _loginServiceService: LoginServiceService,
    private cookieService: CookieService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(this.currentLang);
    });
    this.browser = this.browserDetectionService.getBrowserInfo();

    this.form = this.fb.group({
      vmycode: ['', [Validators.required]],
      requestId: [new Date().toISOString(), [Validators.required]],
      requestTime: [new Date().toISOString(), [Validators.required]],
    });

    this.otp = this.fb.group({
      otp: ['', [Validators.required]],
    });

    this.pageReload();
  }

  pageReload() {
    const reloaded = sessionStorage.getItem('reloaded');

    if (!reloaded) {
      sessionStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }

  onSubmit() {
    // let params = this.form.value;

    // this._loginServiceService.loginConfirm(params).subscribe((data: any) => {
    //   console.log(data);
    // });

    if (this.form.status === 'VALID') {
      this.loading = true;
      const data = this.form.value;
      if (data.vmycode === 'vmy123123') {
        this.showErrorMessage = '';
        this.loading = false;
        this.isRequestedOtp = true;
      } else {
        this.loading = false;
        this.showErrorMessage = 'Your VMY doesn’t exist.';
      }
    }
  }

  login() {
    if (this.otp.status === 'VALID') {
      this.showErrorMessage = '';
      this.loading = true;
      const data = this.otp.value;
      if (data.otp === '123') {
        this.authService.saveTokens(
          '87834uu43iuwr89uf8ae237ei23u2id392803ioiu2398'
        );
        this.loading = false;
        this.router.navigate(['admin/app-statistic']);
      } else {
        this.loading = false;
        this.showErrorMessage = 'Wrong OTP.';
      }
    }
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  isOtpValid(): boolean {
    return this.otp.valid;
  }

  cancel() {
    this.isRequestedOtp = false;
    this.showErrorMessage = '';
    this.form.value.vmycode = '';
    this.isFormValid();

    window.location.reload();
  }
}
