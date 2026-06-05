import { Component, signal } from '@angular/core';
import {
  form,
  required,
  validate,
  FormField,
  validateTree,
  schema,
  apply,
} from '@angular/forms/signals';
import { confirmPasswordSchema } from './schemas';

interface FormModel {
  password: string;
  confirmPassword: string;
  names: {
    name1: string;
    name2: string;
    name3: string;
    name4: string;
  };
}

@Component({
  selector: 'app-cross-field-validation',
  imports: [FormField],
  templateUrl: './cross-field-validation.component.html',
  styleUrl: './cross-field-validation.component.css',
})
export class CrossFieldValidation {
  protected formModel = signal<FormModel>({
    password: '',
    confirmPassword: '',
    names: {
      name1: '',
      name2: '',
      name3: '',
      name4: '',
    },
  });

  protected form = form(this.formModel, (schema) => {
    apply(schema, confirmPasswordSchema);

    validateTree(schema.names, ({ value, fieldTreeOf }) => {
      const fields = Object.keys(value()).map((propName) => {
        return {
          value: (value() as any)[propName],
          fieldTree: fieldTreeOf((schema.names as any)[propName]),
        };
      });

      const duplicatedFields: typeof fields = [];

      const uniqueFields = new Set();

      fields
        .filter((field) => !!field.value)
        .forEach((field) => {
          if (uniqueFields.has(field.value)) {
            duplicatedFields.push(field);
          } else {
            uniqueFields.add(field.value);
          }
        });

      if (duplicatedFields.length > 0) {
        return duplicatedFields.map((field) => {
          return {
            kind: 'duplicateField',
            fieldTree: field.fieldTree,
            message: 'Esse nome já está em uso',
          };
        });
      }

      return null;
    });
  });
}
