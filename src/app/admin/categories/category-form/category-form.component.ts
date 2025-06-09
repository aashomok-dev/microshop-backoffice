// src/app/features/categories/category-form/category-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId?: string; // Changed from number to string

  constructor(
      private fb: FormBuilder,
      private categoryService: CategoryService,
      private router: Router,
      private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      parentId: [null]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.categoryId = idParam; // Remove Number() conversion
      this.isEditMode = true;
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: string): void { // Changed from number to string
    this.categoryService.getCategory(id).subscribe({
      next: (category) => this.categoryForm.patchValue(category),
      error: (error) => console.error('Error loading category:', error)
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      if (this.isEditMode && this.categoryId) {
        this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
          next: () => this.goBack(),
          error: (error) => console.error('Error updating category:', error)
        });
      } else {
        this.categoryService.createCategory(categoryData).subscribe({
          next: () => this.goBack(),
          error: (error) => console.error('Error creating category:', error)
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}