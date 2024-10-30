import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { StatisticChildGetSetService } from './statistic-child-get-set.service';
import { StatisticService } from '../../statistic.service';
import { AutoCompleteComponent } from 'src/app/modules/custom/auto-complete/auto-complete.component';

interface SelectStatusType {
  value: string;
  label: string;
}

@Component({
  selector: 'app-statistic-child',
  templateUrl: './statistic-child.component.html',
  styleUrls: ['./statistic-child.component.scss'],
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule, MatIconModule, CommonModule, AutoCompleteComponent],
})
export class StatisticChildComponent implements OnInit {
  searchTable!: FormGroup;

  public branchStatus: SelectStatusType[] = [];
  public townShipStatus: SelectStatusType[] = [];
  public fbbLeaderStatus: SelectStatusType[] = [];
  public d2dStaus: SelectStatusType[] = [];
  public items = [
    {
      label: 'Target',
      backgroundColor: 'bg-[#e4e4e4]',
      value1: '-',
      value2: 1000,
      percentage: '100%',
      check: 'targe',
    },
    {
      label: 'Total Revoke',
      backgroundColor: 'bg-[#A1CDFF]',
      value1: '-',
      value2: 90,
      percentage: '90%',
      check: 'Revoke',
    },
    {
      label: 'Total Reuse',
      backgroundColor: 'bg-[#EBC1FF]',
      value1: '-',
      value2: 10,
      percentage: '1%',
      check: 'Reuse',
    },
    {
      label: 'Total Pending',
      backgroundColor: 'bg-[#F8F49B]',
      value1: '-',
      value2: 900,
      percentage: '50%',
      check: 'Pending',
    },
  ];

  public customerData: SelectStatusType[] = [
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Jane Smith', label: 'Jane Smith' },
    { value: 'Bob Brown', label: 'Bob Brown' },
    { value: 'John Lee', label: 'John Lee' },
    { value: 'Tom Joe', label: 'Tom Joe' },
    { value: 'Jim Black', label: 'Jim Black' },
  ];

  constructor(
    private statisticService: StatisticService,
    private fb: FormBuilder,
    private router: Router,
    private _statisticChildGetSetService: StatisticChildGetSetService
  ) {
  }

  ngOnInit(): void {
    this.searchTable = this.fb.group({
      testing: ['']
    });

    this.statisticService.getStatistic().subscribe((data: any) => {
    });
  }

  searchButton() {
    console.log(this.searchTable.value, ' search table');
  }

  gotoDetailPage(item: any) {
    this._statisticChildGetSetService.setStatistic(item);
    this.router.navigate(['admin/app-customer']);
  }

  onSuggestionSelected(selectedCustomer: any) {
    this.searchTable.get('testing')?.setValue(selectedCustomer.value);
  }
}
