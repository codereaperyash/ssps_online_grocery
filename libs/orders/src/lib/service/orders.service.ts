import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'
import { Order } from '../module/order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  apiUrlOrders = environment.apiUrl + 'orders/';
  apiURLProducts = environment.apiUrl + 'products';

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<Order>{
    return this.http.post<Order>(this.apiUrlOrders, order);
  } 

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrlOrders}`);
  }

  getOrder(Orderid: string): Observable<Order>{
  return this.http.get<Order>(`${this.apiUrlOrders}${Orderid}`);
  }

  updateOrder(orderStatus: {status: string}, Orderid: string): Observable<Order>{
    return this.http.put<Order>(`${this.apiUrlOrders}${Orderid}`, orderStatus);
  }

  deleteOrder(Orderid: string): Observable<unknown>{
    return this.http.delete<unknown>(`${this.apiUrlOrders}${Orderid}`);
  }

  getOrdersCount(): Observable<number> {
    return this.http
     .get<number>(`${this.apiUrlOrders}/get/count`)
     .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  getTotalSales(): Observable<number> {
    return this.http
     .get<number>(`${this.apiUrlOrders}/get/totalsales`)
     .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  getProduct(productId: string): Observable<any> {
     return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
  }
}