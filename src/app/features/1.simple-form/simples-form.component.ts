import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-simples-form',
  imports: [FormField, JsonPipe],
  templateUrl: './simples-form.component.html',
  styleUrl: './simples-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplesForm {
  protected formModel = signal({
    name: '',
    email: '',
  });

  protected form = form(this.formModel);

  protected reset() {
    this.form().reset({
      email: '',
      name: '',
    });
  }

  protected setValue() {
    this.formModel.set({
      email: 'email@gake.com',
      name: 'Fake',
    });
  }
}
