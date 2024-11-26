import { Component, computed, HostListener, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})

export class AdminComponent implements OnInit {
  collapsed = signal(false);
  isMobile = window.innerWidth <= 800;
  isLaptop = window.innerWidth <= 1024;

  code = this.cookieService.get('vmyCode');
  role = this.cookieService.get('role');

  // Dynamically computed sidenav width
  sidenavWidth = computed(() => {
    if (this.isMobile) return this.collapsed() ? '0px' : '210px';
    else return this.collapsed() ? '0px' : '210px';
  });

  sidenavMode = computed(() => (this.isMobile ? 'over' : 'side')); // Dynamically adjust sidenav mode
  sidenavOpened = computed(() => !this.collapsed() && this.isMobile); // Dynamic opened state for mobile

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.adjustLayout();
  }

  // Adjust layout properties on window resize
  @HostListener('window:resize', [])
  onResize(): void {
    this.adjustLayout();
  }

  adjustLayout(): void {
    this.isMobile = window.innerWidth <= 800;

    // Automatically collapse if mobile or laptop
    if (this.isMobile) this.collapsed.set(true);
    else this.collapsed.set(false);
  }

  logOut(): void {
    this.cookieService.delete('vmyCode');
    this.cookieService.delete('role');
    this.authService.logOut();
    this.router.navigate(['login']);
  }

  onSidenavToggle(isOpened: boolean): void {
    this.collapsed.set(!isOpened);
  }
}
