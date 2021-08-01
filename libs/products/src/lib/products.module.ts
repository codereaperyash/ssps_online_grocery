import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoryBannerComponent } from './components/category-banner/category-banner.component';
import { RouterModule } from '@angular/router';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';


import {ButtonModule} from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {DataViewModule} from 'primeng/dataview';
import {RatingModule} from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import {InputNumberModule} from 'primeng/inputnumber';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path:'category/:categoryid',
    component: ProductsListComponent
  },
  {
    path: 'products/:productid',
    component: ProductPageComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    TagModule,
    DataViewModule,
    RatingModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    DynamicDialogModule,
    ToastModule,
    InputNumberModule
  ],
  declarations: [
    ProductsSearchComponent,
    CategoryBannerComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent
  ],
  exports: [
    ProductsSearchComponent,
    CategoryBannerComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent
  ],
  providers:[
    MessageService,
    DialogService
  ]
})
export class ProductsModule {}
