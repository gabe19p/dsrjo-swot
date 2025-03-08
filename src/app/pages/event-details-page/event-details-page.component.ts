import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { EntriesService } from '../../services/entries.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    ReactiveFormsModule,
  ],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.scss',
})
export class EventDetailsPageComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;

  testEntryForm!: FormGroup; // testing validation
  swotEntryForm!: FormGroup;

  eventId!: string; // variable to hold specific event
  eventDetails: any; // variable to hold event's entries
  loading: boolean = false; // boolean for the dialogs buttons (uses a spinner)
  swotEntry: any = {
    description: '',
    category: '',
    type: '',
    importance: '',
    score: 5,
    notes: '',
  };
  selectedEntry: any = {};
  categories: { label: string; value: string }[] = [];

  /**
   * boolean variables for the dialog visibility
   */
  displayAddSwotDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private entriesService: EntriesService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
    this.loadEventDetails();
    this.loadCategories();

    this.testEntryForm = this.fb.group({
      title: ['', Validators.required],
    });

    this.swotEntryForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      importance: ['', Validators.required],
      score: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      notes: ['', Validators.required],
    });
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

  onOpenAddDialog() {
    console.log('Add entry clicked');
    this.displayAddSwotDialog = true;
  }

  onCloseAddDialog() {
    this.displayAddSwotDialog = false;
  }

  onSaveSwotEntry() {
    this.loading = true;
    if (this.swotEntryForm.valid) {
      this.entriesService
        .createSwotEntry(this.eventId, this.swotEntryForm.value)
        .pipe(
          tap({
            next: (response) => {
              console.log('Swot entry submitted, ', response);
              this.onCloseAddDialog();
              this.loadEventDetails();
            },
            error: (error) => {
              this.loading = false;
              if (error.status === 400 && error.error?.message) {
                alert(error.error.message);
              } else {
                console.log(error);
                alert(
                  'There was an error creating the category. Please try again.'
                );
              }
            },
            complete: () => {
              this.loading = false;
            },
          })
        )
        .subscribe();
    } else {
      console.log('Form is invalid');
      this.swotEntryForm.markAllAsTouched(); // highlight errors
    }
  }

  onSubmit() {}
}
