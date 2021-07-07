import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MenuModule } from 'primeng/menu';
import { MenuComponent } from './components/menu/menu.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TruncateAddressPipe } from './pipes/truncateAddress.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { FooterComponent } from './components/footer/footer.component';
import { WcaTableComponent } from './components/wca-table/wca-table.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { WcaDetailComponent } from './components/wca-detail/wca-detail.component';
import { ToastModule } from 'primeng/toast';
import { TimeAgoPipe } from './pipes/timeAgo.pipe';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ProgressBarModule } from 'primeng/progressbar';
import { MyWcaComponent } from './components/my-wca/my-wca.component';
import { AboutComponent } from './components/about/about.component';
import { CreateWcaComponent } from './components/create-wca/create-wca.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    TruncateAddressPipe,
    TruncatePipe,
    FooterComponent,
    WcaTableComponent,
    WcaDetailComponent,
    TimeAgoPipe,
    MyWcaComponent,
    AboutComponent,
    CreateWcaComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    RippleModule,
    TabViewModule,
    TableModule,
    TooltipModule,
    CardModule,
    DividerModule,
    ToastModule,
    TagModule,
    ProgressBarModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CheckboxModule,
    StepsModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
