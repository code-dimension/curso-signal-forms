import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

enum Themes {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

enum Frequencies {
  Daily = 'daily',
  Weekly = 'weekly',
}

const themeLabelMapper: Record<Themes, string> = {
  [Themes.Light]: 'Claro',
  [Themes.Dark]: 'Escuro',
  [Themes.System]: 'Sistema',
};

const frequencyLabelMapper: Record<Frequencies, string> = {
  [Frequencies.Daily]: 'Diário',
  [Frequencies.Weekly]: 'Semanal',
};

function createThemeOptions() {
  return Object.values(Themes).map((theme) => ({
    label: themeLabelMapper[theme],
    value: theme,
  }));
}

function createFrequencyOptions() {
  return Object.values(Frequencies).map((frequency) => ({
    label: frequencyLabelMapper[frequency],
    value: frequency,
  }));
}

interface FormModel {
  nickname: string | null;
  age: number | string | null;
  date: Date | string;
  time: Date | string;
  datetime: number | string;
  theme: Themes;
  receiveNews: boolean;
  frequency: Frequencies;
}

@Component({
  selector: 'app-native-fields',
  imports: [FormField, JsonPipe],
  templateUrl: './native-fields.component.html',
  styleUrl: './native-fields.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeFields {
  protected themeOptions = signal(createThemeOptions());

  protected frequencyOptions = signal(createFrequencyOptions());

  protected formModel = signal<FormModel>({
    nickname: null,
    age: null,
    date: new Date().toISOString(),
    time: '04:50',
    datetime: Date.now(),
    theme: '' as Themes,
    receiveNews: false,
    frequency: '' as Frequencies,
  });

  protected form = form(this.formModel);

  datetimeToISO = computed(() => new Date(this.formModel().datetime).toISOString());
}
