import { Routes } from '@angular/router';
import { SimplesForm } from './features/1.simple-form/simples-form.component';
import { NativeFields } from './features/2.native-fields/native-fields.component';
import { SubForms } from './features/3.sub-forms/sub-forms.component';
import { TranslateModel } from './features/4.translate-model/translate-model.component';
import { ArrayField } from './features/5.array-field/array-field.component';
import { Validators } from './features/6.validators/validators.component';

export const routes: Routes = [
  {
    path: '1-simple-form',
    component: SimplesForm,
  },
  {
    path: '2-native-fields',
    component: NativeFields,
  },
  {
    path: '3-sub-forms',
    component: SubForms,
  },
  {
    path: '4-translate-model',
    component: TranslateModel,
  },
  {
    path: '5-array-field',
    component: ArrayField,
  },
  {
    path: '6-validators',
    component: Validators
  }
];
