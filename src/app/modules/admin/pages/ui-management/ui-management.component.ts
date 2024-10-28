import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ui-management',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './ui-management.component.html',
  styleUrls: ['./ui-management.component.scss'],
})
export class UiManagementComponent {}
