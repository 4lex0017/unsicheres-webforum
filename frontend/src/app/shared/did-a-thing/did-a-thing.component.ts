import {Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-did-a-thing',
  templateUrl: './did-a-thing.component.html',
  styleUrls: ['./did-a-thing.component.scss'],
  animations: [
    trigger('popOverState', [
      state('show', style({
        opacity: 1,
        transform: "scale(2) rotate(360deg)",

      })),
      state('hide', style({
        opacity: 0,
        transform: "scale(0) rotate(0deg)",
      })),

      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('400ms ease-in'))
    ]),
    trigger('popAfterState', [
      state('show', style({
        opacity: 1,
        transform: "scale(1.6)",

      })),
      state('hide', style({
        opacity: 0,
        transform: "scale(1.6)",
      })),

      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('500ms ease-in'))
    ])
  ]
})
export class DidAThingComponent {
  show = false;
  show2 = false;

  constructor() {
  }

  get stateNameOver() {
    return this.show ? 'show' : 'hide'
  }

  get stateNameAfter() {
    return this.show2 ? 'show2' : 'hide2'
  }

  toggleAfter() {
    this.show2 = !this.show2;
  }

  toggleOver() {
    this.show = !this.show;
  }

  turnOff() {
    // this.show = false;
    // this.show2 = false;
  }

}
