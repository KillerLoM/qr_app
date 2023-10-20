import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication,provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { provideRouter } from '@angular/router';
import routes from './app/app-routing.module';
platformBrowserDynamic().bootstrapModule(AppModule)
