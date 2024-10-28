import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

type MenuItem = {
  label: string;
  status?: boolean; // Optional since it might not be present at the top level
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class TreeViewComponent implements OnInit {
  @Input() menuItem!: MenuItem[];
  @Input() accessRole: string[] = [];
  @Input() editArray!: string[];

  @Output() accessRoleChange = new EventEmitter<string[]>();

  public selectLabel!: string;
  public all_subItems: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.all_subItems = this.menuItem.reduce((acc: any, item: any) => {
      return acc.concat(item.subItems);
    }, []);

    if (this.editArray.length > 0)
      this.editArray.forEach((item: any) => {
        this.onToggle(item.label);
      });
  }

  toggleNested(item: MenuItem) {
    if (item.label === this.selectLabel) this.selectLabel = '';
    else if (item.label === 'All') {
      this.selectLabel = 'All';
      this.accessRole = [];
      this.accessRoleChange.emit(this.accessRole);
    } else this.selectLabel = item.label;
  }

  onToggle(label: string) {
    if (this.accessRole.includes(label)) {
      this.accessRole = this.accessRole.filter((item) => item !== label);
    } else {
      this.accessRole = [...this.accessRole, label];
      if (this.accessRole.length === this.all_subItems.length)
        this.toggleNested({ label: 'All' });
    }

    this.accessRoleChange.emit(this.accessRole);
  }
}
