import { Component, Input } from '@angular/core';
import { ICrime } from '../../types/crimes';
import { CrimesService } from '../../service/crimes.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-crimes-table',
  standalone: true,
  imports: [NgFor],
  template: `
    <table class="p-2 w-full text-sm lg:text-base">
      <thead
        class="px-1 leading-[110%] uppercase text-primary bg-muted text-center"
      >
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Date</th>
          <th scope="col">Location</th>
          <th scope="col">Description</th>
        </tr>
      </thead>

      <tbody>
        <tr
          *ngFor="let crime of crimes"
          [attr.data-active]="crime.investigation_status === 'Open'"
          class="px-1 leading-[110%] hover:bg-muted/50 data-[active=true]:bg-destructive/70 data-[active=true]:hover:bg-destructive transition-colors cursor-pointer"
        >
          <td class="text-center px-2" scope="row">{{ crime.id }}</td>
          <td class="text-center px-2 min-w-[100px]">{{ crime.date }}</td>
          <td>{{ crime.location }}</td>
          <td>{{ crime.description }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class CrimesTableComponent {
  @Input() crimes!: ICrime[];

  constructor(private crimesService: CrimesService) {}
}
