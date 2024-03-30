import { finalize } from 'rxjs';
import { PersonsService } from '../service/persons.service';
import { PaginatedData } from '../types';
import { IPerson } from '../types/persons';

export class PersonManager {
  public persons: PaginatedData<IPerson> | null = null;
  constructor(
    protected personService: PersonsService,
    protected finalizePipe: () => void
  ) {}

  public updatePersonList(person: IPerson) {
    return () => {
      const persons = this.persons;
      if (!persons) {
        throw new Error('Persons are unavaiable');
      }
      this.personService.getById(person.id).subscribe((data) => {
        this.persons = {
          ...persons,
          items: persons.items.map((item) =>
            item.id === person.id ? data : item
          ),
        };
      });
    };
  }

  public deletePerson(personId: number) {
    const persons = this.persons;
    if (!persons) {
      throw new Error('Persons are unavaiable');
    }
    this.personService.deleteOne(personId).subscribe(() => {
      this.persons = {
        ...persons,
        items: persons.items.filter(({ id }) => id !== personId),
      };
    });
  }

  public fetchPrevious() {
    if (!this.persons) {
      throw new Error('Persons are unavaiable');
    }
    const previousPage = this.persons.page - 1;
    if (previousPage < 1) {
      return;
    }
    return this.fetchPersons(previousPage);
  }

  public fetchNext() {
    if (!this.persons) {
      throw new Error('Persons are unavaiable');
    }
    const nextPage = this.persons.page + 1;
    if (nextPage > this.persons.total / this.persons.per_page) {
      return;
    }
    return this.fetchPersons(nextPage);
  }

  public fetchPersons(page: number = 1) {
    this.personService
      .list(page)
      .pipe(finalize(this.finalizePipe))
      .subscribe((data) => {
        this.persons = data;
      });
  }
}
