import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

interface FormModel {
  emails: string[];
}

@Component({
  selector: 'app-array-field',
  imports: [FormField, JsonPipe],
  templateUrl: './array-field.component.html',
  styleUrl: './array-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayField {
  protected formModel = signal<FormModel>({
    emails: [''],
  });

  protected form = form(this.formModel);

  protected hasLessThanTwoEmails = computed(() => {
    return this.form.emails().value().length < 2;
  })

  add() {
    this.form.emails().value.update((value) => [...value, '']);
  }

  remove(index: number) {
    this.form.emails().value.update((value) => {
      return value.filter((email, i) => i !== index);
    });
  }
}
