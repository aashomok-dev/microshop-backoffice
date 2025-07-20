import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductPage } from '../../../core/models/product.interface';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
import { ProductDetailsDialogComponent } from "../product-details-dialog/product-details-dialog.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['productName', 'productPrice', 'quantityInStock', 'productBrand', 'active', 'actions'];
  dataSource: MatTableDataSource<Product>;
  products: Product[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;


  constructor(
      private productService: ProductService,
      private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Product>([]);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadProducts(): void {
    this.productService.getProducts(this.pageIndex, this.pageSize)
        .subscribe({
          next: (data: ProductPage) => {
            this.products = data.content;
            this.dataSource.data = data.content; // Update MatTableDataSource
            this.totalElements = data.totalElements;
          },
          error: (error) => {
            console.error('Error loading products:', error);
          }
        });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  refreshProducts(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.pageIndex = 0;
    this.pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.loadProducts();
  }

  openProductDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: product || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: string): void { // Changed type from number to string
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  showProductDetails(product: Product): void {
    this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      data: product
    });
  }
}