import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './views/contact-list/contact-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'contactos', pathMatch: 'full' },
  { path: 'contactos', component: ContactListComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
