import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss'],
})
export class SubMenuComponent implements OnInit {
  @Input() item!: MenuItem;
  @Output() closeSidenav = new EventEmitter<void>();
  sideNavCollapsed = signal(false);
  nestedMenuOpen = signal(false);

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '38' : '50'));

  toggleNested(item: MenuItem) {

    this.closeSidenav.emit();
    if (!item.subItems) return;
    this.nestedMenuOpen.set(!this.nestedMenuOpen());
    // Emit event to close sidenav
  }
}
