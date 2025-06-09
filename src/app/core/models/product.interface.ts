// src/app/core/models/products.interface.ts

export interface Product {
    id: string;
    sellerId: string;
    productName: string;
    productDescription: string;
    productPrice: MoneyAmount;
    discountedPrice?: MoneyAmount | null;
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

interface MoneyAmount {
    amount: number;
    currencyUnit: CurrencyUnit;
}

interface CurrencyUnit {
    code: string;
    symbol: string;
}

export interface ProductPage {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}