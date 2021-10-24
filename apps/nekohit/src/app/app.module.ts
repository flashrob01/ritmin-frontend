import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MenuComponent } from './menu/menu.component';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TimelineModule } from 'primeng/timeline';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FooterComponent } from './footer/footer.component';
import { CarouselModule } from 'primeng/carousel';
import { SharedModule } from './shared/shared.module';
import { FeaturedProjectService } from './home/featured-project/featured-project.service';
import { FeaturedProjectComponent } from './home/featured-project/featured-project.component';
import { RxState } from '@rx-angular/state';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    FeaturedProjectComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MenubarModule,
    ChartModule,
    TimelineModule,
    CarouselModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    CoreModule,
    AppRoutingModule,
  ],
  providers: [FeaturedProjectService, RxState],
  bootstrap: [AppComponent],
})
export class AppModule {}
