/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { ProductsService } from '@codereaper/products';
import { CartItemDetailed } from '@codereaper/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject;

  constructor(
    private route: Router,
    private cartService: CartService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getCartItems();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  private _getCartItems(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cartitem)=>{
      this.cartItemDetailed = [];
      this.cartCount = cartitem?.items?.length ?? 0;
      cartitem.items.forEach((cartitem)=>{
        //@ts-ignore: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
        this.productsService.getProduct(cartitem.product).subscribe((cartproduct)=>{
          this.cartItemDetailed.push(
            {
              product: cartproduct,
              quantity: cartitem.quantity
            }
          )
        })
      })
    })
  }

  backToProducts(){
    this.route.navigate(['/products']);
  }

  deleteItem(productid: string){
    this.cartService.deleteCartItem(productid);
    this.showSuccess();
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Aight!', detail: 'Item removed from cart :)'});
  }

  //@ts-ignore: Parameter 'event' implicitly has an 'any' type.
  updateCartItemQuantity(event, cartItem: CartItemDetailed){
    this.cartService.setCartItem({
      product: cartItem.product.id,
      quantity: event.value
    }, true)

  }
}
