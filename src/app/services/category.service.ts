import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl =
    'https://nodeappapis-aef6fgczecbggeec.japanwest-01.azurewebsites.net/api/swot/categories';
  private allCategoriesUrl =
    'https://nodeappapis-aef6fgczecbggeec.japanwest-01.azurewebsites.net/api/swot/categories';

  constructor(private http: HttpClient) {}

  createCategory(category: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { category });
  }

  getActiveCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getOneCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${category}`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.allCategoriesUrl);
  }

  updateCategory(oldCategory: string, newCategory: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${oldCategory}`, {
      category: newCategory,
    });
  }

  deleteCategory(category: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${category}`);
  }
}
