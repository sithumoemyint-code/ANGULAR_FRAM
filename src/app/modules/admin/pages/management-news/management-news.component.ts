import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-management-news',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './management-news.component.html',
  styleUrls: ['./management-news.component.scss'],
})
export class ManagementNewsComponent {}
