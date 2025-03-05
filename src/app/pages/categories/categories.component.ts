// Angular Imports
import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
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

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    CommonModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FloatLabelModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesComponent {
  // dialog visibility variables
  displayAddDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  displayRestoreDialog: boolean = false;
  displayEditDialog: boolean = false;

  // variables for crud apis
  newCategory: string = '';
  selectedCategory: any = null;
  editedCategoryName: string = '';

  categories: any[] = [];
  loading: boolean = false;
  pageLoading: boolean = true;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // populates the table
  loadData(): void {
    this.pageLoading = true;
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data.data;
        console.log(this.categories);
        this.pageLoading = false;
      },
      (error) => {
        console.log('Error loading the data', error);
      }
    );
  }

  onOpenAddDialog() {
    console.log('Add category clicked');
    this.displayAddDialog = true; // set visibility flag to true
    this.newCategory = ''; // clear previous inputs
  }

  onCloseAddDialog() {
    this.displayAddDialog = false;
  }

  onSaveCategory() {
    if (this.newCategory.trim()) {
      this.loading = true; // Set loading state to true before API call
      this.categoryService
        .createCategory(this.newCategory)
        .pipe(
          tap({
            next: (response) => {
              console.log('Category created:', response);
              this.onCloseAddDialog(); // Close the dialog
              this.newCategory = ''; // Clear the input
              this.loadData(); // Optionally reload categories if needed
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
              this.loading = false; // Reset the loading state after the API call completes
            },
          })
        )
        .subscribe(); // Subscribe to trigger the observable
    } else {
      alert('Please enter a category name!');
    }
  }

  onOpenDeleteDialog(category: any) {
    this.selectedCategory = category;
    console.log(`Delete clicked on ${this.selectedCategory}`);
    this.displayDeleteDialog = true;
  }

  onCloseDeleteDialog() {
    this.displayDeleteDialog = false;
  }

  onDeleteCategory() {
    this.loading = true;
    if (this.selectedCategory) {
      this.categoryService
        .deleteCategory(this.selectedCategory)
        .pipe(
          tap({
            next: () => {
              this.loadData(); // reload the table
              this.onCloseDeleteDialog(); //close the dialog
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log('Delete completed');
              this.loading = false;
            },
          })
        )
        .subscribe();
    }
  }

  onOpenRestoreDialog(category: any) {
    this.selectedCategory = category;
    console.log(`Restore clicked at ${this.selectedCategory}`);
    this.displayRestoreDialog = true;
  }

  onCloseRestoreDialog() {
    console.log('Restore dialog closed.');
    this.displayRestoreDialog = false;
  }

  onRestoreCategory() {
    this.loading = true;
    if (this.selectedCategory) {
      this.categoryService
        .restoreCategory(this.selectedCategory)
        .pipe(
          tap({
            next: (response) => {
              console.log('Category restored: ', response);
              this.loadData(); // reload the table
              this.onCloseRestoreDialog();
            },
            error: (err) => {
              console.log('Error in restore', err);
            },
            complete: () => {
              console.log('Restore complete');
              this.loading = false;
            },
          })
        )
        .subscribe();
    }
  }

  onOpenEditDialog(category: any) {
    this.selectedCategory = category;
    this.editedCategoryName = category.category; // Pre-fill with the current category name
    this.displayEditDialog = true;
  }

  onCloseEditDialog() {
    this.displayEditDialog = false;
  }

  onSaveEditCategory() {
    if (this.editedCategoryName.trim() && this.selectedCategory) {
      this.loading = true;
      this.categoryService
        .updateCategory(this.selectedCategory.category, this.editedCategoryName)
        .pipe(
          tap({
            next: (response) => {
              console.log('Category updated:', response);
              this.onCloseEditDialog(); // Close the dialog
              this.editedCategoryName = ''; // Clear the input
              this.loadData(); // Reload categories
            },
            error: (error) => {
              this.loading = false;
              if (error.status === 400 && error.error?.message) {
                // Check if the error is the "New name is the same as the current name" message
                alert(error.error.message); // Display the API error message
              } else {
                console.error('Error updating category:', error);
                alert(
                  'There was an error updating the category. Please try again.'
                );
              }
            },
            complete: () => {
              this.loading = false; // Reset loading state
            },
          })
        )
        .subscribe();
    } else {
      alert('Please enter a valid category name!');
    }
  }
}
