import {Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition, stagger, query} from '@angular/animations';

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
        query('.text1',[
          stagger(0,[animate(200,style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
          ]),
        query('.text2',[
          stagger(0,[animate(200,style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ]),
        query('.text3',[
          stagger(0,[animate(200,style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ]),
        query('.text4',[
          stagger(0,[animate(200,style({opacity: 1, transform: "translate3d(0,-150%,0)"}))])
        ])
        ])]),
      /*
      transition('hide => show', [
        query('.text1',[style({opacity:1}),
          stagger(300,[animate(300,style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true}),
        query('.text2',[style({opacity:1}),
          stagger(500,[animate(300,style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true}),
        query('.text3',[style({opacity:1}),
          stagger(700,[animate(300,style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true}),
        query('.text4',[style({opacity:1}),
          stagger(900,[animate(300,style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true})
      ])]),

       */

     /*
    trigger('popAfterState', [
      state('hide', style({opacity: 0})),
      state('show', style({opacity: 1})),
      transition('show => hide', [
        query('.text1',[
          stagger(500,[animate(300,style({opacity: 0, transform: "translate3d(0,-100%,0)"}))])
        ], {optional:true}),]),
      transition('hide => show', [
        query('.text1',[style({opacity:0}),
          stagger(300,[animate('300ms ease-in',style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true})])]),
    trigger('popAfterState2', [
      state('hide', style({opacity: 0})),
      state('show', style({opacity: 1})),
      transition('show => hide', [
        query('.text2',[
          stagger(500,[animate(300,style({opacity: 0, transform: "translate3d(0,-100%,0)"}))])
        ], {optional:true})]),
      transition('hide => show', [
        query('.text2',[style({opacity:0}),
          stagger(300,[animate('300ms ease-in',style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true})])]),
    trigger('popAfterState3', [
      state('hide', style({opacity: 0})),
      state('show', style({opacity: 1})),
      transition('show => hide', [
        query('.text3',[
          stagger(500,[animate(300,style({opacity: 0, transform: "translate3d(0,-100%,0)"}))])
        ], {optional:true})]),
      transition('hide => show', [
        query('.text3',[style({opacity:0}),
          stagger(300,[animate('300ms ease-in',style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true})])]),
    trigger('popAfterState4', [
      state('hide', style({opacity: 0})),
      state('show', style({opacity: 1})),
      transition('show => hide', [
        query('.text4',[
          stagger(500,[animate(300,style({opacity: 0, transform: "translate3d(0,-100%,0)"}))])
        ], {optional:true})]),
      transition('hide => show', [
        query('.text4',[style({opacity:0}),
          stagger(300,[animate('300ms ease-in',style({opacity: 1, transform: "translate3d(0, 100%,0)"}))])
        ], {optional:true})])])


      state('show', style({
        opacity: 1,
        transform: "scale(1.6) translate3d(0,25%,0)",

      })),
      state('hide', style({
        opacity: 0,
        transform: "scale(1.6) translate3d(0,-100%,0)",
      })),

      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('300ms ease-in'))


    ]),
    */
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
