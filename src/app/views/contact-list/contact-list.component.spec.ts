import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactsHttpService } from 'src/app/services/contacts-http.service';
import { ContactListComponent } from './contact-list.component'

describe('Lista de Contactos', () => {
  let fixture: ComponentFixture<ContactListComponent>;
  let component: ContactListComponent;
  let contactsHttpSpy: jasmine.SpyObj<ContactsHttpService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {

    contactsHttpSpy = jasmine.createSpyObj<ContactsHttpService>('ContactsHttpService', ['getAll', 'create', 'update', 'remove'])
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open'])

    TestBed.configureTestingModule({
      declarations: [ContactListComponent],
      providers: [
        { provide: ContactsHttpService, useValue: contactsHttpSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))


  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })


  it('El metodo load debe inicializar el atributo contacts', () => {
    contactsHttpSpy.getAll.and.returnValue(of([
      { id: 1, name: 'Test', phone: 999 },
      { id: 2, name: 'Test', phone: 999 }
    ]));
    component.load()
    expect(component.contacts.length).toBe(2);
  })
  
  
  it('El metodo create debe agregar un contacto', () => {
    const newContact = { id: 1, name: 'Test', phone: 999 };
    contactsHttpSpy.create.and.returnValue(of(newContact));
    component.create(newContact)
    expect(component.contacts.length).toBe(1);
  })

  it('El metodo update debe actualizar un contacto', () => {
    const newContact = { id: 1, name: 'Test', phone: 999 };
    contactsHttpSpy.create.and.returnValue(of(newContact));
    component.create(newContact)

    expect(component.contacts.length).toBe(1);


    newContact.name = 'Test Updated'
    contactsHttpSpy.update.and.returnValue(of(newContact));
    component.update(newContact);

    expect(component.contacts.length).toBe(1);
    expect(component.contacts[0].name).toBe(newContact.name);
  })
  
  it('El metodo remove debe eliminar un contacto', () => {
    const newContact = { id: 1, name: 'Test', phone: 999 };
    contactsHttpSpy.create.and.returnValue(of(newContact));
    component.create(newContact)

    expect(component.contacts.length).toBe(1);

    contactsHttpSpy.remove.and.returnValue(of({}));
    component.remove(newContact);

    expect(component.contacts.length).toBe(0);
  })

  it('El componente debe abrir modal de confirmacion para eliminar', () => {
    const newContact = { id: 1, name: 'Test', phone: 999 };

    const dialogRef = { afterClosed: () => of(true) } as MatDialogRef<unknown>;


    dialogSpy.open.and.returnValue(dialogRef);

    component.openRemoveConfirmModal(newContact);

    expect(dialogSpy.open).toHaveBeenCalled();
  })

  it('El componente debe abrir modal de confirmacion para eliminar', () => {
    const newContact = { id: 1, name: 'Test', phone: 999 };

    const dialogRef = { afterClosed: () => of(true) } as MatDialogRef<unknown>;

    dialogSpy.open.and.returnValue(dialogRef);

    spyOn(dialogRef, 'afterClosed').and.returnValue(of(newContact));

    component.openFormModal(newContact);

    expect(dialogSpy.open).toHaveBeenCalled();
  })

  it('El componente debe abrir modal de confirmacion para eliminar', () => {
    const newContact = { id: 0, name: 'Test', phone: 999 };

    const dialogRef = { afterClosed: () => of(true) } as MatDialogRef<unknown>;

    dialogSpy.open.and.returnValue(dialogRef);

    spyOn(dialogRef, 'afterClosed').and.returnValue(of(newContact));


    component.openFormModal(newContact);

    expect(dialogSpy.open).toHaveBeenCalled();
  })


  
  

})