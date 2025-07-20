import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductPage } from '../models/product.interface';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(page: number = 0, size: number = 10): Observable<ProductPage> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
            
        return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
            map(products => ({
                content: products,
                totalElements: products.length,
                totalPages: 1,
                size: size,
                number: page
            }))
        );
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: string, product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}