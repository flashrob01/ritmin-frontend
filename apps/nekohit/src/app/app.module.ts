import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { MenuComponent } from './menu/menu.component';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
    DropdownModule,
    FormsModule,
    ChartModule,
    InputTextModule,
    TimelineModule,
    CardModule,
    TranslateModule.forRoot(
      {
        defaultLanguage: 'en'
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
