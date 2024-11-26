import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class PaginatorComponent implements OnInit {
  @Input() offset: number = 0;
  @Input() totalOffset: number = 0;
  @Output() change = new EventEmitter<number>();

  ngOnInit(): void {
  }

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
    return this.totalOffset + 1 || 1;
  }
}
