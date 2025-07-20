import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../core/models/product.interface';

@Component({
    selector: 'app-product-details-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './product-details-dialog.component.html',
    styleUrls: ['./product-details-dialog.component.scss']
})
export class ProductDetailsDialogComponent {
    additionalPropertiesArray: Array<{key: string, value: string}>;

    constructor(
        public dialogRef: MatDialogRef<ProductDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Product
    ) {
        this.additionalPropertiesArray = Object.entries(data.additionalProperties)
            .map(([key, value]) => ({key, value}));
    }
}