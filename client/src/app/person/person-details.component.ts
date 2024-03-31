import { Component, Input } from '@angular/core';
import { IPerson } from '../../types/persons';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="border p-4 flex justify-between items-center">
      <div class="w-1/3 h-1/3 aspect-square overflow-hidden">
        <img
          class="border"
          src="https://st4.depositphotos.com/1717437/20205/v/450/depositphotos_202054218-stock-illustration-incognito-unknown-person-silhouette-man.jpg"
          alt="User Avatar"
        />
      </div>
      <p class="text-center w-full text-2xl">
        {{ person.first_name }} <br />
        {{ person.last_name }}
      </p>
    </div>
    <ul>
      <li class="flex space-x-2 mt-4 justify-between">
        <span>First Name</span>
        <span>{{ person.first_name }}</span>
      </li>
      <li class="flex space-x-2 justify-between">
        <span>Last Name</span>
        <span>{{ person.last_name }}</span>
      </li>
      <li class="flex space-x-2 justify-between">
        <span>Date of Birth</span>
        <span>{{ person.date_of_birth }}</span>
      </li>
      <li class="flex space-x-2 justify-between">
        <span>Gender</span>
        <span>{{ person.gender }}</span>
      </li>
      <li class="flex space-x-2 justify-between" [attr.title]="person.address">
        <span>Address</span>
        <span>{{ person.address.slice(0, 20) + '...' }}</span>
      </li>
      <li class="flex space-x-2 justify-between">
        <span>Citizenship</span>
        <span>{{ person.citizenship }}</span>
      </li>
      <li class="flex space-x-2 justify-between">
        <span>Phone Number</span>
        <span>{{ person.phone_number }}</span>
      </li>
      <li class="flex space-x-2 justify-between">
        <span>Email</span>
        <span>{{ person.email }}</span>
      </li>
      <li class="flex space-x-2 justify-between truncate">
        <span>Country of Birth</span>
        <span>{{ person.country_of_birth }}</span>
      </li>
      <li
        *ngIf="person.investigation_status !== null"
        class="flex space-x-2 justify-between"
      >
        <span>Investigation Status</span>
        <span>{{ person.investigation_status }}</span>
      </li>
      <li
        *ngIf="person.danger_level !== null"
        class="flex space-x-2 justify-between"
      >
        <span>Danger Level</span>
        <span>{{ person.danger_level }}</span>
      </li>
    </ul>
  `,
})
export class PersonDetailsComponent {
  @Input() person!: IPerson;
}
