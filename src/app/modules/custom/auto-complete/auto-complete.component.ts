import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule
  ],
})
export class AutoCompleteComponent implements OnInit {
  @Input() label: string = 'Select';
  @Input() placeholder: string = 'Type to search...';
  @Input() suggestions: { value: string; label: string; }[] = [];
  @Output() selectedSuggestion = new EventEmitter<any>();

  currentIndex: number = -1;
  searchControl = new FormControl('');
  showSuggestions: boolean = false;
  filteredSuggestions: string[] = [];
  private valueChangesSubscription!: Subscription

  ngOnInit(): void {
    this.subscribeToValueChanges();
  }

  private subscribeToValueChanges() {
    this.valueChangesSubscription = this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) => {
        this.filterSuggestions(value || '');
        this.currentIndex = -1;
      });
  }

  private filterSuggestions(value: string) {
    this.filteredSuggestions = this.suggestions
      .filter((item) => item.value.toLowerCase().includes(value.toLowerCase()))
      .map((item) => item.value);
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  onSelectSuggestion(suggestion: string) {
    const selected = this.suggestions.find((item) => item.value.toLowerCase() === suggestion.toLowerCase());

    if (selected) {
      this.selectedSuggestion.emit(selected);
      this.searchControl.setValue(suggestion);
    }

    this.filteredSuggestions = [];
    this.showSuggestions = false;

    if (this.valueChangesSubscription) this.valueChangesSubscription.unsubscribe();
    this.subscribeToValueChanges();
  }

  hideSuggestions() {
    setTimeout(() => (this.showSuggestions = false), 100);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.currentIndex < this.filteredSuggestions.length - 1) {
        this.currentIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.currentIndex >= 0 && this.currentIndex < this.filteredSuggestions.length) {
        this.onSelectSuggestion(this.filteredSuggestions[this.currentIndex]);
      }
    }
  }

  onFocus() {
    if (this.valueChangesSubscription.closed) this.subscribeToValueChanges();
  }
}
