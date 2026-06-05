import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterOutlet, RouterLink } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected menuItems = signal(this.createMenuItems());

  private createMenuItems() {
    return routes.map((route) => {
      return {
        label: this.createMenuItemLabel(route.path!),
        route: route.path,
      };
    });
  }

  private createMenuItemLabel(route: string) {
    return route
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
