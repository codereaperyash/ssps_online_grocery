/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @angular-eslint/component-selector */

import { Component,  OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '@codereaper/products';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';
import { CartItem, CartService } from '@codereaper/orders';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./dataView.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  endSubs$: Subject<any> = new Subject;
  categories : Category[] =[];
  categoryButton: boolean = false;

  constructor(
    private productService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.route.params.subscribe((param)=>{
      param.categoryid ? this._getProducts([param.categoryid]) : this._getProducts();
      param.categoryid ? (this.categoryButton = true) : (this.categoryButton = false);
    })
    this._getCategories();
  }

  private _getProducts(categoryFilter?: string[]){
    this.productService.getProducts(categoryFilter).pipe(takeUntil(this.endSubs$)).subscribe((product)=>{
      this.products = product;
    });
  }

  private _getCategories(){
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((category)=>{
      this.categories = category;
    })
  }

  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  categoryFilter(){
    const selectedCategory = this.categories.filter((category)=>category.checked).map((category)=>category.id)
    this._getProducts(selectedCategory);
  }
  
  addToCart(productid: string){
    const cartItem: CartItem = {
      product: productid,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
    this.showSuccess();
  }
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Hooray!', detail: 'Item added to cart :)'});
  }
}
