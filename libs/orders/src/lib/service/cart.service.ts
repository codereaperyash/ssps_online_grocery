/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../module/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  initCartStorage(){
    const cart: Cart = this.getCart();
    if(!cart){
      const initCart = {
        items: []
      };

    const initCartJson = JSON.stringify(initCart);
    localStorage.setItem(CART_KEY, initCartJson);
    }
  }

  getCart(): Cart{
    // @ts-ignore: Argument of type 'string | null' is not assignable to parameter of type 'string'.
    const cartJsonString = localStorage.getItem(CART_KEY);
        // @ts-ignore: Argument of type 'string | null' is not assignable to parameter of type 'string'.
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart{
    const cart = this.getCart();
    const cartFinder = cart.items.find((item)=> item.product === cartItem.product);
    if(cartFinder){
     cart.items.map((item)=>{
       if(item.product === cartItem.product){
         if(updateCartItem){
           item.quantity = cartItem.quantity;
         }else{
          item.quantity = item.quantity + cartItem.quantity;
         }
       }
     });
    }else{
      cart.items.push(cartItem);  
    }
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productid: string){
    const cart = this.getCart();
    const newCart = cart.items.filter((item)=> item.product != productid);
    cart.items = newCart;
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);

  }

  emptyCartItem(){
    const initCart = {
      items: []
    };
    const initCartJson = JSON.stringify(initCart);
    localStorage.setItem(CART_KEY, initCartJson);
    this.cart$.next(initCart);
  }
}
