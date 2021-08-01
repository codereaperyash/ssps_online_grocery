/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@codereaper/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ORDER_STATUS } from '../order.constants';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  orders: Order;
  orderStatuses = [];
  endSubs$: Subject<any> = new Subject;
  selectedStatus: any;
  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getOrderStatuses();
    this._getOrder();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }
  private _getOrderStatuses(){
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key)=>{
      return {
        id: key,
        name: ORDER_STATUS[key].lable
      }
    })
  }
  private _getOrder(){
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params)=>{
      if(params.id){
        this.ordersService.getOrder(params.id).subscribe((order)=>{
          this.orders = order;
          this.selectedStatus = order.status;
        })
      }
    })
  }
  changeStatus(event){
      this.confirmationService.confirm({
      message: 'Are you sure that you want to update the Order Status?',
      header: 'Update Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.updateOrder({status: event.value.id}, this.orders.id).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`Order Status updated :)`});
         },
         (error: Error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Order Status cannot be updated :('});
        });   
      }
  });
  }
}
