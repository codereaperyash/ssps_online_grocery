/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: [ './dataView.scss' ]
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {

  featuredProducts: Product[] = [];
  endSubs$ :Subject<any> = new Subject;

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this._getFeaturedProducts();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  private _getFeaturedProducts(){
    this.productsService.getFeatuedProducts(3).pipe(takeUntil(this.endSubs$)).subscribe((product)=>{
      this.featuredProducts = product;    
    })
  }
}
