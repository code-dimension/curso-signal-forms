import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

interface FormModel {
  personalData: {
    name: string
    email: string
  },
  address: {
    zipcode: null
    street: string
    number: null
  }
}

@Component({
  selector: 'app-sub-forms',
  imports: [FormField, JsonPipe],
  templateUrl: './sub-forms.component.html',
  styleUrl: './sub-forms.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubForms {

  protected formModel = signal<FormModel>({
    personalData: {
      name: '',
      email: '',
    },
    address: {
      zipcode: null,
      street: '',
      number: null,
    },
  })

  protected form = form(this.formModel)
}
