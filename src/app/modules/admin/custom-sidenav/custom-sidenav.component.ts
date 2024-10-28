import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { buildMenuItems, menuItem } from '../../service/menu-items';
import { MenuTranslationService } from '../../service/menu-translation.service';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  permission?: string;
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-custom-sidenav',
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.scss'],
})
export class CustomSidenavComponent implements OnInit {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  public menuItems: MenuItem[] = [];
  public menuItem = signal<MenuItem[]>([]);

  constructor(
    private cookieService: CookieService,
    private menuTranslationService: MenuTranslationService
  ) {}

  ngOnInit(): void {
    this.getPermissionMenuList();

    this.menuTranslationService.onLanguageChange().subscribe(() => {
      this.getPermissionMenuList();
    });
  }

  public getPermissionMenuList() {
    // const groupPermissionCookieValue =
    //   this.cookieService.get('groupPermission');
    // const groupPermission = groupPermissionCookieValue
    //   ? JSON.parse(groupPermissionCookieValue)
    //   : [];

    // const hasAdminManagement = groupPermission.some(
    //   (item: any) => item.name === 'Admin Management'
    // );

    // const updatedGroupPermission = hasAdminManagement
    //   ? groupPermission.filter((item: any) => item.name !== 'Role Management')
    //   : groupPermission;

    // this.menuTranslationService
    //   .getTranslatedMenuItems()
    //   .subscribe((translations) => {
    //     const groupPermissionMenu = buildMenuItems(translations).filter(
    //       (menuItem: any) =>
    //         updatedGroupPermission.some(
    //           (permissionItem: any) =>
    //             permissionItem.name === menuItem.permission
    //         )
    //     );
    //     this.menuItem.set(groupPermissionMenu);
    //   });

    this.menuItem.set(menuItem);
  }

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '38' : '50'));
}
