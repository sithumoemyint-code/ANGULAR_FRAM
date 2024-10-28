import { Component } from '@angular/core';
import { AdminModule } from '../../admin.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

}
