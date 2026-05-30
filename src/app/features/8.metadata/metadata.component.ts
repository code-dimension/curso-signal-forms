import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  createManagedMetadataKey,
  createMetadataKey,
  form,
  FormField,
  maxLength,
  metadata,
  MetadataReducer,
  minLength,
  required,
} from '@angular/forms/signals';
import { debounceTime } from 'rxjs';

const USERNAME_HELP = createMetadataKey<string>();

const HELP_LIST = createMetadataKey<string, string[]>(MetadataReducer.list());

const sumReducer: MetadataReducer<number, number> = {
  getInitial: () => 0,
  reduce: (acc, item) => acc + item,
};

const PASSWORD_SCORE = createMetadataKey<number, number>(sumReducer);

const USERNAME_GENERATOR = createManagedMetadataKey((value: Signal<string | undefined>) => {
  const response = signal<string | null>(null);

  const debouncedValue = toSignal(toObservable(value).pipe(debounceTime(500)));

  const resourceRef = httpResource<{ id: number; username: string }[]>(() => {
    const username = debouncedValue();

    if (!username) {
      return undefined;
    }

    return `http://localhost:3000/usernames?username:eq=${username}`;
  });

  effect(() => {
    if (!resourceRef.hasValue()) {
      return;
    }

    const isUsernameTaken = resourceRef.value().length > 0;

    if (isUsernameTaken) {
      const ramdonNumber = Math.floor(Math.random() * 1000);
      const newUsername = `${value()}${ramdonNumber}`;

      untracked(() => {
        response.set(newUsername);
      });
    } else {
      untracked(() => {
        response.set(null);
      });
    }
  });

  return response;
});

interface FormModel {
  username: string;
  password: string;
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
  protected readonly HELP_LIST = HELP_LIST;
  protected readonly USERNAME_GENERATOR = USERNAME_GENERATOR;

  protected formModel = signal<FormModel>({
    username: '',
    password: '',
  });

  protected form = form(this.formModel, (schema) => {
    required(schema.username, { message: 'Username é obrigatório' });
    minLength(schema.username, 5, { message: 'Username precisa ter pelo menos 5 caracteres' });
    maxLength(schema.username, 20, { message: 'Username precisa ter menos de 20 caracteres' });

    metadata(schema.username, USERNAME_GENERATOR, ({ value }) => value());

    metadata(schema.username, USERNAME_HELP, (fieldContext) => {
      const value = fieldContext.value();
      const valueLength = value.length;
      const minLength = fieldContext.state.minLength!()!;
      const maxLength = fieldContext.state.maxLength!()!;
      const touched = fieldContext.state.touched();

      if (!touched) {
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

    metadata(schema.password, HELP_LIST, () => 'Mensagem 1');
    metadata(schema.password, HELP_LIST, () => 'Mensagem 2');

    metadata(schema.password, PASSWORD_SCORE, (fieldContext) => {
      if (fieldContext.value().length > 5) {
        return 25;
      } else {
        return 0;
      }
    });

    metadata(schema.password, PASSWORD_SCORE, (fieldContext) => {
      if (/[A-Z]/.test(fieldContext.value())) {
        return 25;
      } else {
        return 0;
      }
    });

    metadata(schema.password, PASSWORD_SCORE, (fieldContext) => {
      if (/[^a-zA-Z0-9]/.test(fieldContext.value())) {
        return 50;
      } else {
        return 0;
      }
    });
  });

  protected passwordScore = computed(() => {
    const score = this.form.password().metadata(PASSWORD_SCORE)!();

    if (score <= 25) {
      return 'Fraco';
    }

    if (score <= 50) {
      return 'Normal';
    }

    return 'Forte';
  });

  protected passwordScoreClass = computed(() => {
    const score = this.form.password().metadata(PASSWORD_SCORE)!();

    if (score <= 25) {
      return 'text-error';
    }

    if (score <= 50) {
      return 'text-warning';
    }

    return 'text-success';
  });
}
