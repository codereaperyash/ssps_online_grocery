/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@codereaper/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products=[];
  endSubs$: Subject<any> = new Subject;
  
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getProducts();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  updateProduct(productid: string){
    this.router.navigateByUrl(`products/form/${productid}`);
  }
  deleteProduct(productid: string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete that Product?',
      header: 'Deletion Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.productsService.deleteProduct(productid).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
          this._getProducts();
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`Category successfully Deleted :)`});
        },
        (error: Error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Category cannot be deleted :('});
        });
      }
  });
  }

  private _getProducts(){
    this.productsService.getProducts().pipe(takeUntil(this.endSubs$)).subscribe((products)=>{
      this.products = products;
    })
  }
}
