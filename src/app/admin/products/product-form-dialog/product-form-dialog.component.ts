import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.scss']
})
export class ProductFormDialogComponent {
  productForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private productService: ProductService,
      public dialogRef: MatDialogRef<ProductFormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.productForm = this.fb.group({
      productName: [data.productName || '', [Validators.required]],
      productDescription: [data.productDescription || '', [Validators.required]],
      productPrice: this.fb.group({
        amount: [data.productPrice?.amount || 0, [Validators.required, Validators.min(0)]],
        currencyUnit: this.fb.group({
          code: ['USD'],
          symbol: ['$']
        })
      }),
      quantityInStock: [data.quantityInStock || 0, [Validators.required, Validators.min(0)]],
      productBrand: [data.productBrand || '', [Validators.required]],
      stockKeepingUnit: [data.stockKeepingUnit || '', [Validators.required]],
      weight: [data.weight || 0, [Validators.required, Validators.min(0)]],
      weightUnit: [data.weightUnit || 'г', [Validators.required]],
      categoryIds: [data.categoryIds || [], [Validators.required]],
      active: [data.active ?? true],
      productImageUrl: [data.productImageUrl || ''],
      additionalProperties: [data.additionalProperties || {}]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        id: this.data.id,
        sellerId: this.data.sellerId || 'default',
        creationDate: this.data.creationDate || new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString()
      };

      const request = this.data.id
          ? this.productService.updateProduct(this.data.id, product)
          : this.productService.createProduct(product);

      request.subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving product:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}