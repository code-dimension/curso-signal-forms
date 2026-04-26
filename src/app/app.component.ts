import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, FormField, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
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
