import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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

  currentIndex: number = -1

  searchControl = new FormControl('');
  showSuggestions: boolean = false;
  filteredSuggestions: string[] = [];

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterSuggestions(value || '');
        this.currentIndex = -1;
      });
  }

  private filterSuggestions(value: string) {
    this.filteredSuggestions = this.suggestions
      .filter((item) => item.value.toLowerCase().includes(value.toLowerCase()))
      .map((item) => {
        const formattedPhoneNumber = item.value.replace(/^84/, '0');
        return `${item.value} - ${formattedPhoneNumber}`;
      });
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  onSelectSuggestion(suggestion: string) {
    console.log(suggestion, ' suggestion ')
    const [fullName] = suggestion.split(' - ');
    const selected = this.suggestions.find((item) => item.value.toLowerCase() === fullName.toLowerCase());

    if (selected) {
      this.selectedSuggestion.emit(selected);
      this.searchControl.setValue(suggestion);
    }
    this.filteredSuggestions = [];
    this.showSuggestions = false;
  }

  hideSuggestions() {
    setTimeout(() => (this.showSuggestions = false), 100);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevent the default action
      if (this.currentIndex < this.filteredSuggestions.length - 1) {
        this.currentIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // Prevent the default action
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    } else if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action
      if (this.currentIndex >= 0 && this.currentIndex < this.filteredSuggestions.length) {
        this.onSelectSuggestion(this.filteredSuggestions[this.currentIndex]);
      }
    }
  }
}
