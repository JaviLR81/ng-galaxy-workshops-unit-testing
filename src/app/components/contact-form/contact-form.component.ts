import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactFormData } from 'src/app/interfaces/contact-form-data.interface';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ContactFormComponent>,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ContactFormData
  ) {
    this.form = fb.group({
      id: undefined,
      name: ['', Validators.required],
      phone: ['', Validators.required]
    })

    if (this.data.contact) {
      this.form.patchValue({
        id: this.data.contact.id,
        name: this.data.contact.name,
        phone: this.data.contact.phone,
      })
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value)
    }
  }

}
