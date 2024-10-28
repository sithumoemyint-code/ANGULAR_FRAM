import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent implements OnInit, AfterContentInit {
  hasIcon: boolean = false;
  @Input() customClass: string = '';
  @ContentChild('icon') iconContent: any;

  constructor() {}

  ngAfterContentInit(): void {
    this.hasIcon = !this.iconContent;
  }

  ngOnInit(): void {}
}
