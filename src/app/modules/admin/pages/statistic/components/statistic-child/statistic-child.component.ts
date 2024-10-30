import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';

interface SelectStatusType {
  value: string;
  label: string;
}

@Component({
  selector: 'app-statistic-child',
  templateUrl: './statistic-child.component.html',
  styleUrls: ['./statistic-child.component.scss'],
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule, MatIconModule, CommonModule],
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
    },
    {
      label: 'Total Revoke',
      backgroundColor: 'bg-[#A1CDFF]',
      value1: '-',
      value2: 90,
      percentage: '90%',
    },
    {
      label: 'Total Reuse',
      backgroundColor: 'bg-[#EBC1FF]',
      value1: '-',
      value2: 10,
      percentage: '1%',
    },
    {
      label: 'Total Pending',
      backgroundColor: 'bg-[#F8F49B]',
      value1: '-',
      value2: 900,
      percentage: '50%',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.branchStatus = [
      { value: 'TEST', label: 'test' },
      { value: 'TEST1', label: 'test1' },
      { value: 'TEST2', label: 'test2' },
    ];

    this.townShipStatus = [
      { value: 'Yangon', label: 'Yangon' },
      { value: 'Bago', label: 'Bago' },
      { value: 'MDL', label: 'MDL' },
    ];

    this.fbbLeaderStatus = [
      { value: 'Yung', label: 'Yung' },
      { value: 'Ming', label: 'Ming' },
      { value: 'Qing', label: 'Qing' },
    ];

    this.d2dStaus = [
      { value: 'Telenor', label: 'Telenor' },
      { value: 'MyTel', label: 'MyTel' },
      { value: 'Ooredoo', label: 'Ooredoo' },
    ];
  }

  ngOnInit(): void {
    this.searchTable = this.fb.group({
      status: [''],
      township: [''],
      fbbLeader: [''],
      d2d: [''],
    });
  }

  searchButton() {
    console.log(this.searchTable.value, ' search table');
  }
}
