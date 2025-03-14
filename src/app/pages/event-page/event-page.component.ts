import { Component, OnInit, ViewChild } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
import { DatePickerModule } from 'primeng/datepicker';

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
    ReactiveFormsModule,
    DatePickerModule,
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit {
  @ViewChild('eventTable') dt1!: Table;
  events: any[] = [];
  pageLoading: boolean = true;
  loading: boolean = false;

  /**
   * NEW SWOT Event
   */
  swotEventForm!: FormGroup;
  displayAddSwotDialog: boolean = false;
  /**
   * DELETE SWOT Event
   */
  selectedEvent: string = '';
  displayDeleteSwotDialog: boolean = false;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.swotEventForm = this.fb.group({
      swotEventTitle: ['', Validators.required],
      swotEventDate: ['', Validators.required],
    });
  }

  onGlobalSearch(event: Event) {
    const inputEvent = event.target as HTMLInputElement; // Cast the target to HTMLInputElement
    this.dt1.filterGlobal(inputEvent.value, 'contains');
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

  onOpenCreateSwotEvent() {
    this.displayAddSwotDialog = true;
    this.swotEventForm.reset();
  }

  onCloseCreateSwotEvent() {
    this.displayAddSwotDialog = false;
    this.swotEventForm.reset();
  }

  onCreateSwotEvent() {
    this.loading = true;
    if (this.swotEventForm.valid) {
      const formData = { ...this.swotEventForm.value };
      formData.swotEventDate = this.formatDate(formData.swotEventDate);

      this.eventsService
        .createSwotEvent(formData)
        .pipe(
          tap({
            next: (response) => {
              console.log('Success! SWOT Event created: ' + response);
              this.loadEvents();
              this.onCloseCreateSwotEvent();
            },
            error: (error) => {
              console.log('Error: ' + error);
              alert('There was an issue creating the SWOT Event');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
              console.log('SWOT creation pipe complete.');
            },
          })
        )
        .subscribe();
    } else {
      console.log('Form is invalid');
      this.swotEventForm.markAllAsTouched();
    }
  }

  onOpenDeleteSwotEvent(eventId: string) {
    this.selectedEvent = eventId;
    this.displayDeleteSwotDialog = true;
    console.log(this.selectedEvent);
  }

  onCloseDeleteSwotEvent() {
    this.selectedEvent = '';
    this.displayDeleteSwotDialog = false;
  }

  onDeleteSwotEvent() {
    this.loading = true;
    this.eventsService
      .archiveSwotEvent(this.selectedEvent)
      .pipe(
        tap({
          next: (response) => {
            console.log('Successfully archived event. ', response);
            this.loading = false;
            this.loadEvents();
            this.onCloseDeleteSwotEvent();
          },
          error: (error) => {
            console.log('Error in delete: ', error);
            alert('There was an error deleting this event');
          },
          complete: () => {
            console.log('Completed SWOT delete.');
            this.loading = false;
          },
        })
      )
      .subscribe();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD only
  }
}
