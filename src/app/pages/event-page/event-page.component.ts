import { Component } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

// PrimeNg Imports
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    FormsModule,
    CommonModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FloatLabelModule,
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  events: any[] = [];
  pageLoading: boolean = true;

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.pageLoading = true;
    this.eventsService
      .getActiveEvents()
      .pipe(
        tap({
          next: (response) => {
            console.log(response);
            this.events = response.data;
            this.pageLoading = false;
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            console.log('Completed');
          },
        })
      )
      .subscribe();
  }

  goToEventDetails(eventId: string) {
    this.router.navigate([`swot/events/${eventId}`]);
  }
}
