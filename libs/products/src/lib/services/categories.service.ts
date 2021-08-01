import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  apiUrlCategories = environment.apiUrl + 'categories/'

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiUrlCategories}`);
  }

  getCategory(categoryid: string): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrlCategories}${categoryid}`);
  }

  createCategory(category: FormData): Observable<Category>{
    return this.http.post<Category>(`${this.apiUrlCategories}`, category);
  }

  updateCategory(category: FormData, categoryid: string): Observable<Category>{
    return this.http.put<Category>(`${this.apiUrlCategories}${categoryid}`, category);
  }

  deleteCategory(categoryid: string): Observable<unknown>{
    return this.http.delete<unknown>(`${this.apiUrlCategories}${categoryid}`);
  }
}
