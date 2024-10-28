import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-standalone',
  templateUrl: './pagination-standalone.component.html',
  styleUrls: ['./pagination-standalone.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PaginationStandaloneComponent {
  @Input() currentPage: number = 0;
  @Input() totalPage: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPage) this.pageChange.emit(page);
  }

  nextPage() {
    if (this.currentPage < this.totalPage)
      this.pageChange.emit(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1) this.pageChange.emit(this.currentPage - 1);
  }
}
