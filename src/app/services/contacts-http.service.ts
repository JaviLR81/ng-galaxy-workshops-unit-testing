import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactsHttpService {
  endpoind = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.endpoind)
  }

  create(body: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.endpoind, body)
  }

  update(id: number, body: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.endpoind}/${id}`, body)
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.endpoind}/${id}`)
  }
}