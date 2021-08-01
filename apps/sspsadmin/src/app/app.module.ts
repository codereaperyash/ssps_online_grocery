import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from "@angular/common";
import { JWTInterceptor, UsersModule } from '@codereaper/users';
import { Authguard } from '@codereaper/users';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { Routes } from '@angular/router';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import {CardModule} from 'primeng/card';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { CategoriesService } from '@codereaper/products';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ColorPickerModule} from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import {InputMaskModule} from 'primeng/inputmask';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import {FieldsetModule} from 'primeng/fieldset';


const PNG_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  ToastModule,
  ConfirmDialogModule,
  ColorPickerModule,
  InputTextModule,
  DialogModule,
  InputNumberModule,
  InputSwitchModule,
  InputTextareaModule,
  DropdownModule,
  TagModule,
  InputMaskModule,
  FieldsetModule
]

const routes: Routes = [
  {
    path:'',
    component: ShellComponent,
    canActivate: [Authguard],
    children: [
      {
        path:'',
        component: DashboardComponent,
      },
      {
        path:'categories',
        component: CategoriesListComponent,
      },
      {
        path:'categories/form',
        component: CategoriesFormComponent,
      },
      {
        path:'categories/form/:id',
        component: CategoriesFormComponent,
      },
      {
        path:'products',
        component: ProductsListComponent,
      },
      {
        path:'products/form',
        component: ProductsFormComponent,
      },
      {
        path:'products/form/:id',
        component: ProductsFormComponent,
      },
      {
        path:'users',
        component: UsersListComponent,
      },
      {
        path:'users/form',
        component: UsersFormComponent,
      },
      {
        path:'users/form/:id',
        component: UsersFormComponent,
      },
      {
        path:'orders',
        component: OrdersListComponent,
      },
      {
        path: 'orders/:id',
        component: OrdersDetailComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
]
@NgModule({
  declarations: [AppComponent, DashboardComponent, ShellComponent, SidebarComponent, CategoriesListComponent, CategoriesFormComponent, ProductsFormComponent, ProductsListComponent, UsersFormComponent, UsersListComponent, OrdersListComponent, OrdersDetailComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    PNG_MODULE,
    CommonModule,
    UsersModule
  ],
  providers: [CategoriesService, MessageService, ConfirmationService, {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi:true}],
  bootstrap: [AppComponent],
  exports: [
    DashboardComponent,
    ShellComponent,
    SidebarComponent
  ],
})
export class AppModule {}
