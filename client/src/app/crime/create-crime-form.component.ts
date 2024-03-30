import { Component, Input } from '@angular/core';
import { IPerson } from '../../types/persons';
import { FormsModule, NgForm } from '@angular/forms';
import { ICrime, PartialCrime } from '../../types/crimes';
import { CrimesService } from '../../service/crimes.service';

@Component({
  selector: 'app-create-crime-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form
      (ngSubmit)="onSubmit(postCrimeForm)"
      #postCrimeForm="ngForm"
      class="space-y-2 my-4"
    >
      <h5 class="text-xl font-semibold">
        Add crime for {{ target.first_name }} {{ target.last_name }}:
      </h5>
      <div class="flex gap-x-2">
        <input
          name="date"
          class="input"
          type="date"
          placeholder="Date"
          ngModel
          required
        />
        <input
          name="location"
          class="input"
          type="string"
          placeholder="Location"
          ngModel
          required
        />
      </div>
      <textarea
        name="description"
        class="block input"
        placeholder="Description"
        minlength="8"
        ngModel
        required
      ></textarea>
      <input
        name="investigation_status"
        class="block input"
        type="string"
        placeholder="Investigation Status"
        ngModel
        required
      />

      <button
        class="w-full py-1 px-4 uppercase bg-secondary border hover:bg-transparent transition-colors font-medium"
      >
        Add Crime
      </button>
    </form>
  `,
})
export class CreateCrimeFormComponent {
  @Input() target!: IPerson;
  @Input() onCrimeCreate!: (crime: ICrime) => void;

  constructor(private crimesService: CrimesService) {}

  onSubmit(form: NgForm) {
    const crime: PartialCrime = {
      date: form.value.date,
      location: form.value.location,
      description: form.value.description,
      investigation_status: form.value.investigation_status,
      person_id: this.target.id,
    };
    this.crimesService.create(crime).subscribe((data) => {
      this.onCrimeCreate(data);
    });
  }
}
