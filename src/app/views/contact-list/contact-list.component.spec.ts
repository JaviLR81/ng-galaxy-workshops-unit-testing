import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactsHttpService } from 'src/app/services/contacts-http.service';
import { ContactListComponent } from './contact-list.component'


/** NOTAS **/

/*
  Las pruebas unitarias no deben llamar a los servicios
  http como tal solo tenemos que probar nuestro código,
  las respuestas son inciertas,
  tampoco debemos de llamara los servicios como tal que hacen las peticiones
  HTTP

  Podemos trabajar sin el HttpClientModule y mejor usar el modulo de testing

  1.- HttpClientTestingModule lo podemos usar por que satisface el HttpClient
      pero no ejecuta los servicios como tal, lo que si debemos proveer
      es nuestro servicio en los providers aún con el HttpTestingModule

      let contacService: ContactHttpService;

      # Nunca llamamos como tal al http y se provee el objeto
      # http por Angular
      imports: [
        HttpClientTestingModule
      ]
      providers: [
        ContactsService
      ]

      beforeEach( () => {
        fixture.detectChanges();

        # Igual le pasamos la clase original al inject()
        # para inyectar una dependencia
        contactHTTPService = Testbed.inject(ContactHttpService);
      })

      # Espiando
      spyOn(contactService,'getAll').and.callFake ( resp => {
        return of(
          [
            {id: 1, name: test}
          ]
        );
      })

  2.- Sin el HttpTestingModule, usando un servicio Fake para prueba
      que debe imitar la estructura original, por que ya no usamos la
      clase original, tal vez esto es mas reutilizable por que se puede
      abstraer en una clase separada, en este caso ya no necesitamos el
      módulo HttpTestingModule

      # Tiene sus beneficios que es poder tener una carpeta aislada y una
      # clase abstracta para realizar pruebas de código en varias partes de nuestros
      # tests

      # Mock con la misma estrutura pero echa para pruebas
      class HttpContacTestingService{
        getAll(): Observable<Contact[]> {
          return of([ {id: 1, name:'abc'} ])
        }
      }

      # Siempre el tipo de dato es la clase original
      let contacHTTPService: ContactHttpService;

      # Reemplazamos el servicio por la clase Mock para no necesitar
      # módulos externos
      { provide: ContactsHttpService, useClass: HttpContacTestingService },


       # ESTO ES PARA NO HACER REFERENCIA AL SERVICIO PUBLICAMENTE
      # SINO COMO UNA INSTANCIA DE TESTEB.INJECT

      beforeEach( () => {
        fixture.detectChanges();

        # Igual le pasamos la clase original al inject()
        # para inyectar una dependencia
        contactHTTPService = Testbed.inject(ContactHttpService);
      })

      # En este caso podemos hacer uso de callTrough por que como tal si estamos
      # devolviendo ya el observable en nuestra clase fake de testing

      spyOn(contacHTTPService,'getAll').and.callTrough();

      # Pero tambien podemos usar callFake o returnValue es lo mismo
      # solo el return ya no lleva la  () => {}
      # En caso hagamos referencia a la propiedad pública igual se intercepta
      # por que ya esta procesado y proveido por el testbeb

      spyOn('component.contactsHttp','getAll').and.callFake();
      # Or
      spyOn(contacHTTPService,'getAll').and.callFake();

    3.- Con un Jasmine SpyObj

    let contactsHttpSpy: jasmine.SpyObj<ContactsHttpService>;

    beforeEach(waitForAsync(() => {

      # Inicializando el SPY de Jasmine
      contactsHttpSpy = jasmine.createSpyObj<ContactsHttpService>('ContactsHttpService', ['getAll', 'create', 'update', 'remove']);

      # Inicializando el SPY de Jasmine para Angular Material
      dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open'])

      TestBed.configureTestingModule({
        declarations: [ContactListComponent],

        # EN VEZ DE USAR useClass usamos useValue
        providers: [
          { provide: ContactsHttpService, useValue: contactsHttpSpy },
          { provide: MatDialog, useValue: dialogSpy },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }))

    # Podemos utilizar el contactsHTTPSpy directamente sin spyOn

    it('El metodo create debe agregar un contacto', () => {
      const newContact = { id: 1, name: 'Test', phone: 999 };
      contactsHttpSpy.create.and.returnValue(of(newContact));
      component.create(newContact)
      expect(component.contacts.length).toBe(1);
    })

  RECOMENDACIONES

  Podemos crear clases abstractas que ya esten testeadas en una clase padre
  para que no tengamos que probar eso en cada parte del código

  ng test --code-coverage

  branches = tiene que ver con las bifurcaciones if swithc cases
            entre más condicionales tengamos más dificil es subir
            las branches por todas las combinaciones que debemos de realizar
            en nuestras pruebas unitarias

  NOTAS EXTRAS
  No usamos HttpClientTestingModule si el componente como tal no hace una petición HTTP
  si es un servicio esta bien o tal vez el router tal vez con la evaluación de directivas,
  pero para funcionamiento igual podemos hacer un fake router
*/


describe('Lista de Contactos', () => {
  let fixture: ComponentFixture<ContactListComponent>;
  let component: ContactListComponent;
  let contactsHttpSpy: jasmine.SpyObj<ContactsHttpService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {

    // Debemos de definir todos los métodos que queremos probar
    contactsHttpSpy = jasmine.createSpyObj<ContactsHttpService>('ContactsHttpService', ['getAll', 'create', 'update', 'remove'])
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [ContactListComponent],
      providers: [
        // Probando las dependencias de el componente, substituyendo el comportamiento normal
        { provide: ContactsHttpService, useValue: contactsHttpSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      // Recomendable para quitar los errores de HTML, pipes
      // O componentes que no hayamos declarado aquí
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))


  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })


  it('El componente se debe de instanciar', () => {
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(ContactListComponent);
    expect(component.contacts.length).toBe(0);

  });

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

    // Primero se crea un contacto
    const newContact = { id: 1, name: 'Test', phone: 999 };
    contactsHttpSpy.create.and.returnValue(of(newContact));
    component.create(newContact)
    expect(component.contacts.length).toBe(1);

    // Después se pasa el modificado y se pone otro espia
    newContact.name = 'Test Updated'
    contactsHttpSpy.update.and.returnValue(of(newContact));
    component.update(newContact);

    expect(component.contacts.length).toBe(1);
    expect(component.contacts[0].name).toBe(newContact.name);
  })

  it('El metodo remove debe eliminar un contacto', () => {

    // Creando el contacto
    const newContact = { id: 1, name: 'Test', phone: 999 };
    contactsHttpSpy.create.and.returnValue(of(newContact));
    component.create(newContact)
    expect(component.contacts.length).toBe(1);

    // Eliminandolo y retornando un objeto vacio
    contactsHttpSpy.remove.and.returnValue(of({}));
    component.remove(newContact);
    expect(component.contacts.length).toBe(0);
  })

  // Debemos adaptarnos a material para hacer el test
  it('El componente debe abrir modal de confirmacion para eliminar', () => {

    // Objeto para testing
    const newContact = { id: 1, name: 'Test', phone: 999 };

    // Valor del tipo MatDialogRef con la función afterClosed que devuelve un Observable
    const dialogRef = { afterClosed: () => of(true) } as MatDialogRef<unknown>;

    dialogSpy.open.and.returnValue(dialogRef);

    // Método del componente
    component.openRemoveConfirmModal(newContact);

    // Checando si el método del dialog de material fue llamado
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
