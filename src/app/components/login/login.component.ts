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
  loading: boolean = false;
  browser!: string;
  showErrorMessage!: string;
  currentLang = 'vi';

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

    const backgroundUrl = 'url(/assets/image/Gradient.png)';
    const container = this.el.nativeElement.querySelector(
      '.background-container'
    );

    this.renderer.setStyle(container, 'backgroundImage', backgroundUrl);

    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      browser: [this.browser],
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
    if (this.form.status === 'VALID') {
      this.loading = true;
      const data = this.form.value;

      if (data.username === 'admin' && data.password === '123') {
        this.authService.saveTokens(
          '87834uu43iuwr89uf8ae237ei23u2id392803ioiu2398'
        );
        this.loading = false;
        this.router.navigate(['admin/app-statistic']);
      } else {
        this.loading = false;

        this.showErrorMessage = 'Message error show';
      }

      // this._loginServiceService.loginUser(data).subscribe({
      //   next: (response: any) => {
      //     if (response.errorCode === '000') {
      //       const groupedPermissions = Object.values(
      //         response.result.subPermissions.reduce((acc: any, item: any) => {
      //           const { permissionId, name } = item.permission;

      //           // If the permission is not already in the accumulator, add it
      //           if (!acc[permissionId]) {
      //             acc[permissionId] = {
      //               name,
      //               permissionId,
      //               type: [],
      //               subPermissionCode: [],
      //             };
      //           }

      //           // Push the type and subPermissionCode if they are not already present
      //           if (!acc[permissionId].type.includes(item.type))
      //             acc[permissionId].type.push(item.type);
      //           if (
      //             !acc[permissionId].subPermissionCode.includes(
      //               item.subPermissionCode
      //             )
      //           )
      //             acc[permissionId].subPermissionCode.push(
      //               item.subPermissionCode
      //             );
      //           return acc;
      //         }, {})
      //       );
      //       let username = this.form.value.username;
      //       if (username.startsWith('84'))
      //         username = '0' + username.substring(2);
      //       this.cookieService.set('username', username);

      //       const jsonGroupPermission = JSON.stringify(groupedPermissions);
      //       this.cookieService.set('groupPermission', jsonGroupPermission);

      //       this.showErrorMessage = '';
      //       this.authService.saveTokens(response.result.accessToken);
      //       this.loading = false;
      //       this.router.navigate(['admin/app-statistic']);
      //     } else if (response.errorCode === '218') {
      //       this.loading = false;
      //       this.showErrorMessage = response.message;
      //     } else if (response.errorCode === '210') {
      //       this.loading = false;
      //       this.showErrorMessage = response.message;
      //     } else if (response.errorCode === '219') {
      //       this.loading = false;
      //       this.showErrorMessage = response.message;
      //     } else {
      //       this.loading = false;
      //       this.showErrorMessage = response.message || 'Something went wrong.';
      //     }
      //   },
      //   error: (error: any) => {
      //     this.loading = false;
      //     if (error.error.errorCode === '208')
      //       this.showErrorMessage = error.error.message;
      //     else this.showErrorMessage = 'Something went wrong.';
      //   },
      // });
    }
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  switchLanguage() {
    const newLang = this.currentLang === 'vi' ? 'en' : 'vi';
    this.languageService.switchLanguage(newLang);
    this.currentLang = newLang;
  }
}
