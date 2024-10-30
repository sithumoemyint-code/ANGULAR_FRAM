import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatisticChildGetSetService } from '../statistic/components/statistic-child/statistic-child-get-set.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [RouterOutlet],

})
export class CustomerComponent {
}
