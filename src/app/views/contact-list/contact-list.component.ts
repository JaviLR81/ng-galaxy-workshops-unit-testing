import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactFormComponent } from 'src/app/components/contact-form/contact-form.component';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactsHttpService } from 'src/app/services/contacts-http.service';
import { filter } from 'rxjs/operators';
import { ContactFormData } from 'src/app/interfaces/contact-form-data.interface';
import { ContactRemoveConfirmComponent } from 'src/app/components/contact-remove-confirm/contact-remove-confirm.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(
    private contactsHttp: ContactsHttpService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  openFormModal(contact?: Contact) {
    const config: MatDialogConfig<ContactFormData> = {
      disableClose: true,
      data: { contact }
    }
    const dialogRef = this.dialog.open(ContactFormComponent, config);

    dialogRef.afterClosed()
    .subscribe(contact => {
      contact.id ? this.update(contact) : this.create(contact);
    });
  }

  openRemoveConfirmModal(contact: Contact) {
    const dialogRef = this.dialog.open(ContactRemoveConfirmComponent);

    dialogRef.afterClosed()
    .pipe(filter(result => Boolean(result)))
    .subscribe(() => this.remove(contact));
  }

  load() {
    this.contactsHttp.getAll()
    .subscribe(
      contacts => this.contacts = contacts
    )
  }

  create(contactToCreate: Contact) {
    this.contactsHttp.create(contactToCreate)
    .subscribe(
      contactCreated => this.contacts.push(contactCreated)
    )
  }

  update(contactToUpdate: Contact) {
    this.contactsHttp.update(contactToUpdate.id, contactToUpdate)
    .subscribe(
      contactUpdated => {
        const index = this.contacts.findIndex(contact => contact.id === contactUpdated.id)
        this.contacts[index] = contactUpdated;
      }
    )
  }

  remove(contactToRemove: Contact) {
    this.contactsHttp.remove(contactToRemove.id)
    .subscribe(
      () => {
        const index = this.contacts.findIndex(contact => contact.id === contactToRemove.id)
        this.contacts.splice(index, 1);
      }
    )
  }
}
