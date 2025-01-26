import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, query, style, animate, group } from '@angular/animations';

import { TopMenuComponent } from './top-menu/top-menu.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TopMenuComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./../styles.css'],
    animations: [
      trigger('routeAnimation', [
        transition('eventsPage => eventForm', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateX(100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateX(-100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('eventForm => eventsPage', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateX(-100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateX(100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('eventForm => profilePage', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateX(100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateX(-100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('profilePage => eventsPage', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateX(100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateX(-100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('profilePage => eventForm', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateX(-100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateX(100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('eventsPage => profilePage', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateX(-100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateX(100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('eventsPage => eventDetail', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateY(100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateY(-100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
        transition('eventDetail => eventsPage', [
          query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
          query(':enter', style({ transform: 'translateY(-100%)' })),
          group([
            query(':leave', [
              animate('0.4s', style({ transform: 'translateY(100%)' })),
              animate('0.2s', style({ opacity: 0 }))
            ]),
            query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
          ]),
        ]),
      ]),
    ],
})
export class AppComponent {
  title = 'angular-svtickets';

  getState(routerOutlet: RouterOutlet) {
    return routerOutlet.activatedRouteData['animation'] || 'None';
  }
}
