import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiUrlProducts = environment.apiUrl + 'products/'

  constructor(private http: HttpClient) { }

  getProducts(categoryFilter?: string[]): Observable<Product[]>{
    let params = new HttpParams;
    if(categoryFilter){
      params = params.append('categories', categoryFilter.join(','));
    }
    return this.http.get<Product[]>(`${this.apiUrlProducts}`, {params: params});
  }

  getProduct(productid: string): Observable<Product>{
  return this.http.get<Product>(`${this.apiUrlProducts}${productid}`);
  }

  createProduct(productFormData: FormData): Observable<Product>{
    return this.http.post<Product>(`${this.apiUrlProducts}`, productFormData);
  }

  updateProduct(productform: FormData, productid: string): Observable<Product>{
    return this.http.put<Product>(`${this.apiUrlProducts}${productid}`, productform);
  }

  deleteProduct(productid: string): Observable<unknown>{
    return this.http.delete<unknown>(`${this.apiUrlProducts}${productid}`);
 }
  getProductsCount(): Observable<number> {
  return this.http
    .get<number>(`${this.apiUrlProducts}/get/count`)
    .pipe(map((objectValue: any) => objectValue.productCount));
}
  getFeatuedProducts(count:number): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrlProducts}/get/featured/${count}`);
  }
}
