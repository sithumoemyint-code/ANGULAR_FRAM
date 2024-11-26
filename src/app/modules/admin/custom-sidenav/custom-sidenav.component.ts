import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { menuItem } from '../../service/menu-items';

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
  @Output() closeSidenav = new EventEmitter<void>();

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  public menuItems: MenuItem[] = [];
  public menuItem = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.getPermissionMenuList();
  }

  public getPermissionMenuList() {
    this.menuItem.set(menuItem);
  }

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '38' : '50'));

  collapseSidenav(): void {
    // Collapse the sidenav
    this.closeSidenav.emit();
  }
}
