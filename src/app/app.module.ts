import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MenuModule} from 'primeng/menu';
import {MenuComponent} from './components/menu/menu.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RippleModule} from 'primeng/ripple';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {TruncateAddressPipe} from './pipes/truncateAddress.pipe';
import {TooltipModule} from 'primeng/tooltip';
import {FooterComponent} from './components/footer/footer.component';
import {WcaTableComponent} from './components/wca-table/wca-table.component';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {WcaDetailComponent} from './components/wca-detail/wca-detail.component';
import {ToastModule} from 'primeng/toast';
import {TimeAgoPipe} from './pipes/timeAgo.pipe';
import {TagModule} from 'primeng/tag';
import {TruncatePipe} from './pipes/truncate.pipe';
import {ProgressBarModule} from 'primeng/progressbar';
import {AboutComponent} from './components/about/about.component';
import {CreateWcaComponent} from './components/create-wca/create-wca.component';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {StepsModule} from 'primeng/steps';
import {BasicInfoComponent} from './components/create-wca/basic-info/basic-info.component';
import {MsInfoComponent} from './components/create-wca/ms-info/ms-info.component';
import {CalendarModule} from 'primeng/calendar';
import {CompleteComponent} from './components/create-wca/complete/complete.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import {PendingRequestComponent} from './components/pending-request/pending-request.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TimeDurationPipe} from './pipes/time-duration.pipe';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';
import {InventoryComponent} from './components/inventory/inventory.component';
import {DataViewModule} from 'primeng/dataview';

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
    AboutComponent,
    CreateWcaComponent,
    BasicInfoComponent,
    MsInfoComponent,
    CompleteComponent,
    PendingRequestComponent,
    TimeDurationPipe,
    InventoryComponent,
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
    StepsModule,
    CalendarModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    FieldsetModule,
    PanelModule,
    DataViewModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
