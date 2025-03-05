import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { EntriesService } from '../../services/entries.service';
import { CategoryService } from '../../services/category.service';

// primeng imports
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
import { SelectModule } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Slider, SliderModule } from 'primeng/slider';
@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    SelectModule,
    IconField,
    InputIcon,
    RadioButtonModule,
    SliderModule,
  ],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.scss',
})
export class EventDetailsPageComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;

  eventId!: string;
  eventDetails: any;
  editingRow: any = null;
  displayAddSwotDialog: boolean = false;
  loading: boolean = false;
  swotEntry: any = {
    description: '',
    category: '',
    type: '',
    importance: '',
    score: 5,
    notes: '',
  };
  types = [
    { label: 'Strength', value: 'strength' },
    { label: 'Weakness', value: 'weakness' },
    { label: 'Opportunity', value: 'opportunity' },
    { label: 'Threat', value: 'threat' },
  ];
  importanceLevels = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];
  categories: { label: string; value: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private entriesService: EntriesService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
    this.loadEventDetails();
    this.loadCategories();
  }

  onGlobalSearch(event: Event) {
    const inputEvent = event.target as HTMLInputElement; // Cast the target to HTMLInputElement
    this.dt1.filterGlobal(inputEvent.value, 'contains');
  }

  loadEventDetails() {
    this.http
      .get(
        `https://nodeappapis-aef6fgczecbggeec.japanwest-01.azurewebsites.net/api/swot/events/${this.eventId}/entries`
      )
      .pipe(
        tap({
          next: (response: any) => {
            if (response && response.httpCode === '200' && response.data) {
              this.eventDetails = response.data;
            } else {
              console.error('Invalid response format:', response);
            }
          },
          error: (error) => {
            console.log('API error:', error);
          },
          complete: () => {
            console.log('Completed');
          },
        })
      )
      .subscribe();
  }

  loadCategories() {
    this.categoryService
      .getActiveCategories()
      .pipe(
        tap({
          next: (response) => {
            console.log('Categories loaded');
            // Map the categories into dropdown-friendly format
            this.categories = response.data.map((category: any) => ({
              label: category.category, // Category name for display
              value: category.category, // Category ID for value
            }));
          },
          error: (error) => {
            console.log('API error:', error);
          },
          complete: () => {
            console.log(this.categories);
          },
        })
      )
      .subscribe();
  }

  onRowEditInit(entry: any) {
    this.editingRow = { ...entry }; // Keep a copy of the original entry for cancel purposes
    console.log('Editing entry:', entry);
  }

  onRowEditSave(entry: any) {
    console.log('Saving entry:', entry);
    this.entriesService
      .updateEntry(entry._id, entry)
      .pipe(
        tap({
          next: (response) => {
            console.log('Updated entry', response);
            this.loadEventDetails(); // Refresh the event details after saving
          },
          error: (error) => {
            if (error.status === 404 && error.error?.message) {
              alert(error.error.message);
            } else {
              console.log(error);
              alert(
                'There was an error creating the category. Please try again.'
              );
            }
          },
          complete: () => {
            console.log('Completed!');
          },
        })
      )
      .subscribe();
    this.editingRow = null; // Clear the editing state after saving
  }

  onRowEditCancel(entry: any, rowIndex: number) {
    console.log('Cancel editing for row:', rowIndex);
    // Revert the entry to its original state
    const originalEntry = this.editingRow;
    if (originalEntry) {
      const index = this.eventDetails.findIndex(
        (item: any) => item._id === entry._id
      );
      if (index !== -1) {
        this.eventDetails[index] = { ...originalEntry }; // Revert changes
      }
    }
    this.editingRow = null; // Clear the editing state
  }

  onOpenAddDialog() {
    console.log('Add entry clicked');
    this.displayAddSwotDialog = true;
  }

  onCloseAddDialog() {
    this.displayAddSwotDialog = false;
  }

  onSaveSwotEntry() {
    console.log('Saved!');
  }
}
