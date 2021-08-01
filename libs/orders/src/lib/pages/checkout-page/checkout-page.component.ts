/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Cart } from '../../module/cart';
import { Order } from '../../module/order';
import { OrderItem } from '../../module/order_item';
import { CartService } from '../../service/cart.service';
import { OrdersService } from '../../service/orders.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId = "61051cbe02f0390ebea88991";
  countries = [];

  constructor(
    private route: Router,
    private ordersService: OrdersService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getCartItem();
    this._initCheckoutForm();
  }

  private _getCartItem(){
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((items=>{
      return {
        product: items.product,
        quantity: items.quantity
      }
    }))
  }
  private _initCheckoutForm(){
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      doorNo: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      country: ['INDIA'],
    })
  }

  backToCart(){
    this.route.navigate(['/cartpage'])
  }

  get checkoutForm(){
    return this.checkoutFormGroup.controls;
  }

  placeOrder(){
    this.isSubmitted = true;
    if(this.checkoutFormGroup.invalid){
      return;
    }else{
      const order: Order={
        orderItems: this.orderItems,
        deliveryAddress1: this.checkoutForm.doorNo.value,
        deliveryAddress2: this.checkoutForm.street.value,
        city: this.checkoutForm.city.value,
        zip: this.checkoutForm.zip.value,
        country: this.checkoutForm.country.value,
        phone: this.checkoutForm.phone.value,
        user: this.userId,
        status:'pending',
        dateOrdered: `${Date.now()}`
      }
      this.ordersService.createOrder(order).subscribe(()=>{
        this.cartService.emptyCartItem();
        this.route.navigate(['/thankupage'])
      },(error)=>{
        this.showError(error);
      })
    }
  }
  showError(error: Error) {
    this.messageService.add({severity:'danger', summary: 'Oops!', detail: `${error}`});
  }
}
