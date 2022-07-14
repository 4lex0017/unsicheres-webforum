import {Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition, stagger, query} from '@angular/animations';
import {DidAThingServiceService} from "./did-a-thing-service.service";

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

      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('300ms ease-in'))
    ]),

    trigger('popAfterState', [
      state('hide', style({opacity: 1})),
      state('show', style({opacity: 1})),
      transition('show => hide', [
        query('.text1', [
          stagger(0, [animate(200, style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ]),
        query('.text2', [
          stagger(0, [animate(200, style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ]),
        query('.text3', [
          stagger(0, [animate(200, style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ]),
        query('.text4', [
          stagger(0, [animate(200, style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ])
      ])]),

    trigger('popAfterState1', [
      state('show', style({
        opacity: 1,


      })),
      state('hide', style({
        opacity: 1,
        transform: "translate3d(0,-200%,0)",
      })),

      transition('hide => show', animate('300ms ease-in')),
      transition('show => hide', animate('300ms ease-out'))
    ]),
    trigger('popAfterState2', [
      state('show', style({
        opacity: 1,


      })),
      state('hide', style({
        opacity: 1,
        transform: "translate3d(0,-200%,0)",
      })),

      transition('hide => show', animate('400ms ease-in')),
      transition('show => hide', animate('300ms ease-out'))
    ]),
    trigger('popAfterState3', [
      state('show', style({
        opacity: 1,


      })),
      state('hide', style({
        opacity: 1,
        transform: "translate3d(0,-200%,0)",
      })),

      transition('hide => show', animate('500ms ease-in')),
      transition('show => hide', animate('300ms ease-out'))
    ]),
    trigger('popAfterState4', [
      state('show', style({
        opacity: 1,


      })),
      state('hide', style({
        opacity: 1,
        transform: "translate3d(0,-200%,0)",
      })),

      transition('hide => show', animate('600ms ease-in')),
      transition('show => hide', animate('300ms ease-out'))
    ])
  ]
})

export class DidAThingComponent implements OnInit {
  show = false;
  timeLeft: number = 60;
  interval;
  subscribeTimer: any;

  constructor(private didAThing: DidAThingServiceService) {
  }

  get stateNameOver() {
    return this.show ? 'show' : 'hide'
  }

  toggleOver() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 4000)
  }

  ngOnInit(): void {
    this.didAThing.onMessage().subscribe(bool => {
      this.toggleOver();
    })
  }


}
