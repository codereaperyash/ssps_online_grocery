import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './service/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import {BadgeModule} from 'primeng/badge';
import {ToastModule} from 'primeng/toast';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import {InputMaskModule} from 'primeng/inputmask';
import {DropdownModule} from 'primeng/dropdown';
import { ThankyouPageComponent } from './pages/thankyou-page/thankyou-page.component';

const route: Routes = [
  {
    path: 'cartpage',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent
  },
  {
    path: 'thankupage',
    component: ThankyouPageComponent
  }
]

@NgModule({
  imports: [CommonModule, DropdownModule, InputMaskModule, ReactiveFormsModule, FormsModule, RouterModule.forChild(route), BadgeModule, ToastModule, ButtonModule, InputNumberModule, TagModule], 
  declarations: [
    CartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankyouPageComponent
  ],
  exports: [
    CartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankyouPageComponent
  ],
  providers:[
    ConfirmationService,
    MessageService,
    Location
  ]
})
export class OrdersModule {
  constructor(cartService: CartService){
    cartService.initCartStorage();
  }
}
