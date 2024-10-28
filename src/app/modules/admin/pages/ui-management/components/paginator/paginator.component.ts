import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class PaginatorComponent {
  @Input() offset: number = 0;
  @Input() totalOffset: number = 0;
  @Output() change = new EventEmitter<number>();

  nextPage() {
    this.changePage(this.offset + 1);
  }

  prevPage() {
    this.changePage(this.offset - 1);
  }

  changePage(offset: number) {
    this.change.emit(offset);
  }

  get currentPage() {
    return this.offset + 1;
  }
  get totalPage() {
    return this.totalOffset;
  }
}
