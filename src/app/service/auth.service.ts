import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private cookieService: CookieService,
  ) { }

  saveTokens(accessToken: string) {
    this.cookieService.set('accessToken', accessToken)
  }

  logOut() {
    this.cookieService.delete('accessToken')
    this.cookieService.delete('groupPermission')
    this.cookieService.delete('username')
    return this.router.navigate(['login'])
  }
}
