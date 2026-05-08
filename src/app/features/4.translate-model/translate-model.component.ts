import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';

interface FormModel {
  personal: {
    name: string;
    email: string;
  };
  address: {
    zipcode: string;
    street: string;
    number: string;
  };
}

interface DomainModel {
  personal: {
    name: string;
    email: string;
  };
  address: null | {
    zipcode: string | null;
    street: string | null;
    number: string | null;
  };
}

function domainModelToFormModel(domain: DomainModel): FormModel {
  return {
    personal: {
      name: domain.personal.name,
      email: domain.personal.email,
    },
    address: {
      zipcode: domain.address?.zipcode ?? '',
      street: domain.address?.street ?? '',
      number: domain.address?.number ?? '',
    },
  };
}

function formModelToDomainModel(form: FormModel): DomainModel {
  const isAddressEmpty = Object.values(form.address).every((value) => value === '');

  return {
    personal: {
      name: form.personal.name,
      email: form.personal.email,
    },
    address: isAddressEmpty
      ? null
      : {
          zipcode: form.address.zipcode,
          street: form.address.street,
          number: form.address.number,
        },
  };
}

@Component({
  selector: 'app-translate-model',
  imports: [FormField, JsonPipe],
  templateUrl: './translate-model.component.html',
  styleUrl: './translate-model.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslateModel {
  private httpClient = inject(HttpClient);

  private emptyFormModel = signal<FormModel>({
    personal: {
      name: '',
      email: '',
    },
    address: {
      zipcode: '',
      street: '',
      number: '',
    },
  });

  protected profileDataRef = rxResource({
    stream: () => this.getProfile(),
  });

  protected formModel = linkedSignal<FormModel>(() => {
    if (!this.profileDataRef.hasValue()) {
      return this.emptyFormModel();
    }

    return domainModelToFormModel(this.profileDataRef.value());
  });

  protected form = form(this.formModel);

  protected save() {
    const payload = formModelToDomainModel(this.formModel());

    this.saveProfile(payload).subscribe((profile) => {
      console.log('ok', profile);
    });
  }

  private saveProfile(payload: DomainModel) {
    return this.httpClient.put<DomainModel>('http://localhost:3000/profile', payload);
  }

  private getProfile() {
    return this.httpClient.get<DomainModel>('http://localhost:3000/profile');
  }
}
