/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@codereaper/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  product!: Product;
  endSubs$: Subject<any> = new Subject;
  //@ts-ignore: Property 'quantity' has no initializer and is not definitely assigned in the constructor.
  quantity = 1

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cartService: CartService
    ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params)=>{
      if(params.productid){
        this._getProduct(params.productid);
      }
    })
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  private _getProduct(productid: string){
    this.productService.getProduct(productid).pipe(takeUntil(this.endSubs$)).subscribe((product)=>{
      this.product = product;
    })
  }
  addToCart(){
    if(this.product.availability){
      const cartItem: CartItem = {
        product: this.product.id,
        quantity: this.quantity
      };
      this.cartService.setCartItem(cartItem);
      this.showSuccess();
    }else{
      this.showFailure();
    }
    }

    showFailure() {
      this.messageService.add({severity:'success', summary: 'Oops!', detail: 'Item Out of Stock'});
    }
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Hooray!', detail: 'Item added to cart :)'});
  }
}
