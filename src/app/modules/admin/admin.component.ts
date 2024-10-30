import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '240px'));
  code: string = 'VMY123123';
  userName: string = 'Testing';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  logOut() {
    this.authService.logOut();
    this.router.navigate(['login']);
  }
}
