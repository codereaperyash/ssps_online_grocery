/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@codereaper/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  categories = [];
  imageDisplay: string | ArrayBuffer;
  currentProid: string;
  endSubs$: Subject<any> = new Subject;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }
  private _initForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      mrp: ['', Validators.required],
      image: ['', Validators.required],
      category: ['', Validators.required],
      availability: [false, Validators.required],
      isFeatured: [false, Validators.required],
    })
  }
  private _getCategories(){
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((cat)=>{
      this.categories = cat;
    })
  }

  private _updateProduct(productFormData : FormData){

    this.confirmationService.confirm({
      message: 'Are you sure that you want to update that Product?',
      header: 'Updation Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.updateProduct(productFormData, this.currentProid).pipe(takeUntil(this.endSubs$)).subscribe(()=>{

          this.messageService.add({severity:'success', summary:'Hooray!', detail:`Product is updated successfully :)`});
          timer(1000).toPromise().then(()=>{
            this.location.back();
          })
        },
        (error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Product not updated :('});
        });
      }
  });

  }

  private _checkEditMode(){
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe(params=>{
      if(params.id){
        this.editMode = true;
        this.currentProid = params.id;
        this.productsService.getProduct(params.id).subscribe(product=>{
          this.productForm.name.setValue(product.name);
          this.productForm.brand.setValue(product.brand);
          this.productForm.mrp.setValue(product.mrp);
          this.productForm.price.setValue(product.price);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.availability.setValue(product.availability);
          this.productForm.category.setValue(product.category.id);
          this.productForm.description.setValue(product.description);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        })
      }
    })
  }
  get productForm(){
    return this.form.controls;
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
      return console.log('error');
    }else{
      const productFormData =  new FormData();

      Object.keys(this.productForm).map((key)=>{
        productFormData.append(key, this.productForm[key].value);
      })
      if(this.editMode){
        this._updateProduct(productFormData);
      }else{
        this._addProduct(productFormData);
      }
      
    }
  }
  private _addProduct(product: FormData){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to add that Product?',
      header: 'Creation Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.createProduct(product).pipe(takeUntil(this.endSubs$)).subscribe((product: Product)=>{
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`${product.name} is successfully created :)`});
          timer(1000).toPromise().then(()=>{
            this.location.back();
          })
        },
        (error: Error)=>{
          this.messageService.add({severity: `${error}`, summary:'Oops!', detail:'Product not created :('});
        });
      }
  });

  }


  onCalcel(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel the operation?',
      header: 'Cancellation Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        return this.location.back();
      }
  });

  }
}
