import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgFor } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../../services/category.service';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesComponent {
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data.data;
        console.log(this.categories);
      },
      (error) => {
        console.log('Error loading the data', error);
      }
    );
  }
}
