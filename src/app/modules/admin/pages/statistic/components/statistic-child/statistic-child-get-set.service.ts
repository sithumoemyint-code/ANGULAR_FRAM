import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticChildGetSetService {

  public selectedStatistic!: string
  private _isSelected = new BehaviorSubject<any>(this.selectedStatistic)

  constructor() { }

  setStatistic(selected: string): void {
    this._isSelected.next(selected)
  }

  clearStatistic(): void {
    this._isSelected.next(undefined);
  }

  get checkStatistic() {
    return this._isSelected.asObservable()
  }
}
