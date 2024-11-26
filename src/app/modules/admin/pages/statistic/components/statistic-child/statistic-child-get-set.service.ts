// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class StatisticChildGetSetService {

//   public selectedStatistic!: string
//   private _isSelected = new BehaviorSubject<any>(this.selectedStatistic)

//   constructor() { }

//   setStatistic(selected: string): void {
//     this._isSelected.next(selected)
//   }

//   clearStatistic(): void {
//     this._isSelected.next(undefined);
//   }

//   get checkStatistic() {
//     return this._isSelected.asObservable()
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticChildGetSetService {
  // Define the type of data you will store (you can define a more specific interface if needed)
  public selectedStatistic: any = {}; // Can be an object to hold multiple values
  private _isSelected = new BehaviorSubject<any>(this.selectedStatistic);

  constructor() {}

  // Store multiple data in the service
  setStatistic(statistic: any): void {
    this._isSelected.next(statistic);
  }

  // Clear the stored statistic
  clearStatistic(): void {
    this._isSelected.next(undefined);
  }

  // Observable to get the current selected statistic
  get checkStatistic() {
    return this._isSelected.asObservable();
  }
}
