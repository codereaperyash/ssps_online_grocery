/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CartService } from '../../service/cart.service';
import { OrdersService } from '../../service/orders.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  totalPrice!: number;
  totalMrp!: number;
  endSubs$: Subject<any> = new Subject;
  isCheckout = false;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private router: Router
  ) { 
    this.router.url.includes('checkout') ? this.isCheckout = true : this.isCheckout = false;
  }

  ngOnInit(): void {
    this._getOrderDetail();
  }

  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.complete();
  }
  private _getOrderDetail(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart)=>{
      this.totalMrp = 0;
      this.totalPrice = 0;
      if(cart){
        cart.items.map((item)=>{
          //@ts-ignore: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
          this.ordersService.getProduct(item.product).pipe(take(1)).subscribe((product)=>{
            this.totalPrice += product.price * item.quantity;
            this.totalMrp += product.mrp * item.quantity;
          })
        })
      }
    })
  }
  toCheckOutPage(){
    if(this.totalPrice !== 0)
    this.router.navigate(['./checkout'])
  }
}
