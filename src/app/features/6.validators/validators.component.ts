import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';

interface Employee {
  username: string;
  age: number;
  email: string;
}

@Component({
  selector: 'app-validators',
  imports: [FormField],
  templateUrl: './validators.component.html',
  styleUrl: './validators.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Validators {
  employeeModel = signal<Employee>({
    username: '',
    age: 0,
    email: '',
  });

  form = form(this.employeeModel, (schema) => {
    required(schema.username, { message: 'Username é obrigatório' });
    minLength(schema.username, 5, {
      message: 'Username precisa ter pelo menos 5 caracteres',
    });
    maxLength(schema.username, 15, {
      message: 'Username precisa ter menos de 15 caracteres',
    });
    pattern(schema.username, /^[a-z0-9@]+$/, {
      message: 'Username deve conter apenas letras minúsculas e números',
    });

    validate(schema.username, ({ value }) => {
      if (!value().startsWith('@')) {
        return {
          kind: 'missingAt',
          message: 'Username precisa começar com @',
        };
      }

      return null;
    });

    required(schema.age, { message: 'Idade é obrigatória' });
    min(schema.age, 18, { message: 'Idade precisa ser maior que 18 anos' });
    max(schema.age, 65, { message: 'Idade precisa ser menor que 65 anos' });

    required(schema.email, { message: 'Email é obrigatório' });
    email(schema.email, { message: 'Email inválido' });
  });
}
