/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@codereaper/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
 
  endSubs$: Subject<any> = new Subject;
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  currentCatid: string;
  imageDisplay: string | ArrayBuffer;

  constructor(
    private location: Location,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['', Validators.required],
      icon:['', Validators.required],
      color: ['#fff'],
      image: ['', Validators.required]
    })
    this._checkEditMode();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }
  onCancel(){
   this.confirmationService.confirm({
    message: 'Are you sure that you want to cancel Category Updation / Creation?',
    header: 'Cancel Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.location.back();
    }
});
  }
  onImageUpload(event){
    const file = event.target.files[0];
    if(file){
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = ()=>{
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);
    }
  }
  onCreate(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }
    const categoryFormData = new FormData();

    Object.keys(this.categoryForm).map((key)=>{
      categoryFormData.append(key, this.categoryForm[key].value);
    })

    if(this.editMode){
      this._updateCategory(categoryFormData);
    }else{
      this._addCategory(categoryFormData);
    }
    

  }
  get categoryForm(){
    return this.form.controls;
  }
  private _checkEditMode(){
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe(params=>{
      if(params.id){
        this.currentCatid = params.id;
        this.editMode = true;
        this.categoryService.getCategory(params.id).subscribe(category=>{
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
          this.categoryForm.color.setValue(category.color);
        })
      }
    })
  }
  private _addCategory(category: FormData){
    this.categoryService.createCategory(category).pipe(takeUntil(this.endSubs$)).subscribe((category: Category)=>{
      this.messageService.add({severity:'success', summary:'Hooray!', detail:`Category ${category.name} successfully created :)`});
      timer(1000).toPromise().then(()=>{
        this.location.back();
      })
    },
    (error: Error)=>{
      this.messageService.add({severity: `${error}`, summary:'Oops!', detail:'Category not created :('});
    });
  }

  private _updateCategory(category: FormData){
    this.categoryService.updateCategory(category, this.currentCatid).pipe(takeUntil(this.endSubs$)).subscribe((category: Category)=>{
      this.editMode=false;
      this.messageService.add({severity:'success', summary:'Hooray!', detail:`Category ${category.name} updated successfully :)`});
      timer(1000).toPromise().then(()=>{
        this.location.back();
      })
    },
    (error)=>{
      this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Category not updated :('});
    });
  }
}
