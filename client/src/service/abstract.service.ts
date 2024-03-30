import type { Observable } from 'rxjs';
import type { HttpClient } from '@angular/common/http';

export abstract class BaseService<T> {
  protected _url: string;
  protected _http: HttpClient;

  constructor(http: HttpClient, path: string) {
    this._http = http;
    this._url = `http://localhost:8000/${path}`;
  }

  create(data: Omit<T, 'id'>): Observable<T> {
    return this._http.post<T>(this._url, data);
  }

  getById(id: number): Observable<T> {
    return this._http.get<T>(`${this._url}/${id}`);
  }

  deleteOne(id: number): Observable<T> {
    return this._http.delete<T>(`${this._url}/${id}`);
  }
}
