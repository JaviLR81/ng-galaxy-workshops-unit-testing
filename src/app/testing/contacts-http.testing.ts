import { Observable, of } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';

export class ContactsHttpTestingService {
  getAll(): Observable<Contact[]> {
    return of([
      { id: 1, name: 'Test', phone: 999 },
    ])
  }
}