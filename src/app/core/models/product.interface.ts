// src/app/core/models/products.interface.ts

export interface Product {
    id: string;
    sellerId: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    discountedPrice?: number | null;
    productBrand: string;
    stockKeepingUnit: string;
    quantityInStock: number;
    weight: number;
    weightUnit: string;
    additionalProperties: { [key: string]: string };
    categoryIds: string[];
    productImageUrl: string;
    creationDate: string;
    lastUpdatedDate: string;
    active: boolean;
}

export interface ProductPage {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}