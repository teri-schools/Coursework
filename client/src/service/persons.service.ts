import type { IPerson } from "../types/persons";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./abstract.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaginatedData } from "../types";

@Injectable({ providedIn: 'root' })
export class PersonsService<T = IPerson> extends BaseService<T> {
  constructor(http: HttpClient) {
    super(http, 'persons');
  }

  list(page: number = 1): Observable<PaginatedData<T>> {
    return this._http.get<PaginatedData<T>>(this._url, { params: { page, per_page: 20 }});
  }
}