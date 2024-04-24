/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  // bootstrapApplication(AppComponent, {
  //   providers: [
  //     provideAnimations()]})
