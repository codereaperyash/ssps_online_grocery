/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@codereaper/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { ORDER_STATUS } from '../order.constants';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  orderStatus = ORDER_STATUS;
  endSubs$: Subject<any> = new Subject;

  constructor(
    private ordersService: OrdersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }

  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  private _getOrders(){
    this.ordersService.getOrders().pipe(takeUntil(this.endSubs$)).subscribe((orders)=>{
      this.orders = orders;
    })
  }

  deleteOrder(orderid){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete that order?',
      header: 'Deletion Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.ordersService.deleteOrder(orderid).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
          this._getOrders();
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`Order successfully Deleted :)`});
        },
        (error: Error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Order cannot be deleted :('});
        });
      }
  });
  }
  orderDetail(orderid){
    this.router.navigateByUrl(`orders/${orderid}`);
  }
}
