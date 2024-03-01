import type { IPerson } from "../types/persons";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./abstract.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PersonsService extends BaseService<IPerson> {
  constructor(http: HttpClient) {
    super(http, 'persons');
  }
}