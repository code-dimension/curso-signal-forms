import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

interface FormModel {
  name: string;
}

@Component({
  selector: 'app-state-classes',
  imports: [FormField],
  templateUrl: './state-classes.component.html',
  styleUrl: './state-classes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateClasses {

  protected formModel = signal<FormModel>({
    name: '',
  })

  protected form = form(this.formModel, schema => {
    required(schema.name, { message: 'Name é obrigatório' })
  })

}
