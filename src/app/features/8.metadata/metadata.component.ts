import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { createMetadataKey, form, FormField, maxLength, metadata, minLength, required } from '@angular/forms/signals';

const USERNAME_HELP = createMetadataKey<string>();

interface FormModel {
  username: string;
}

@Component({
  selector: 'app-metadata',
  imports: [FormField],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Metadata {

  protected readonly USERNAME_HELP = USERNAME_HELP;

  protected formModel = signal<FormModel>({
    username: '',
  });

  protected form = form(this.formModel, (schema) => {

    required(schema.username, { message: 'Username é obrigatório' });
    minLength(schema.username, 5, { message: 'Username precisa ter pelo menos 5 caracteres' });
    maxLength(schema.username, 20, { message: 'Username precisa ter menos de 20 caracteres' });

    metadata(schema.username, USERNAME_HELP, (fieldContext) => {
      const value = fieldContext.value();
      const valueLength = value.length;
      const minLength = fieldContext.state.minLength!()!
      const maxLength = fieldContext.state.maxLength!()!
      const touched = fieldContext.state.touched()

      if(!touched) {
        if (valueLength === 0) {
          return `Digite um username com no mínimo ${minLength} e no máximo ${maxLength} caracteres`;
        }

        if (valueLength < 5) {
          return 'Boa! Continue digitando...';
        }
      }

      if (valueLength >= 5 && valueLength <= 20) {
        return 'Muito bom! Esse username está ótimo.';
      }

      return '';
    });
  });
}
