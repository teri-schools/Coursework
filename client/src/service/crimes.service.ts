import type { ICrime } from "../types/crimes";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./abstract.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CrimesService extends BaseService<ICrime> {
  constructor(http: HttpClient) {
    super(http, 'crimes');
  }

  getPersonCrimes(personId: string) {
    return this._http.get(`${this._url}/${personId}/crimes`);
  }
}