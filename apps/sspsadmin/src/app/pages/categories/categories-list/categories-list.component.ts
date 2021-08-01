/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@codereaper/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endSubs$: Subject<any> = new Subject;

  constructor(
    private messageService: MessageService,
    private categoryService: CategoriesService,
    private confirmationService: ConfirmationService,
    private router: Router) 
    { }

  ngOnInit(): void {
    this._getCategory();
  }

  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  deleteCategory(categoryid: string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete that category?',
      header: 'Deletion Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.categoryService.deleteCategory(categoryid).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
          this._getCategory();
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`Category successfully Deleted :)`});
        },
        (error: Error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Category cannot be deleted :('});
        });
      }
  });
  }

  updateCategory(categoryid: string){
    this.router.navigateByUrl(`categories/form/${categoryid}`)
  }

  private _getCategory(){
    return this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((category)=>{
      this.categories = category;
    });
  }

}
