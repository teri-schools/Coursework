import type { PaginatedData } from '../types';
import type { Observable } from 'rxjs';
import type { HttpClient } from '@angular/common/http';

export abstract class BaseService<T> {
  protected _url: string;
  protected _http: HttpClient;

  constructor(http: HttpClient, path: string) {
    this._http = http;
    // TEMP
    this._url = `http://localhost:8000/${path}`;
  }

  create(data: T): Observable<T> {
    return this._http.post<T>(this._url, data);
  }

  getById(id: string): Observable<T> {
    return this._http.get<T>(`${this._url}/${id}`);
  }

  updateOne(id: string, data: Partial<T>): Observable<T> {
    return this._http.put<T>(`${this._url}/${id}`, data);
  }

  deleteOne(id: string): Observable<T> {
    return this._http.delete<T>(`${this._url}/${id}`);
  }

  list(page: number = 1): Observable<PaginatedData<T>> {
    return this._http.get<PaginatedData<T>>(this._url, { params: { page, per_page: 20 }});
  }
}
