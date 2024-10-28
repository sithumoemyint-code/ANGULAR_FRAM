import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class CustomerManagementComponent {}
