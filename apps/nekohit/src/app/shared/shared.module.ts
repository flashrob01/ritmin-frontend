import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { TimelineModule } from 'primeng/timeline';
import { SkeletonModule } from 'primeng/skeleton';
import { TruncateAddressPipe } from './pipes/truncateAddress.pipe';
import { SanitizedHtmlPipe } from './pipes/sanitized-html.pipe';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ConnectWalletComponent } from './components/connect-wallet/connect-wallet.component';
import { ChartModule } from 'primeng/chart';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
  declarations: [
    TruncatePipe,
    TruncateAddressPipe,
    SanitizedHtmlPipe,
    AvatarComponent,
    ConnectWalletComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    ProgressBarModule,
    CommonModule,
    TagModule,
    TooltipModule,
    InputNumberModule,
    TimelineModule,
    SkeletonModule,
    ChartModule,
    DynamicDialogModule,
    ToastModule,
    InputTextareaModule,
    DividerModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule,
    ConfirmPopupModule,
  ],
  exports: [
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    ProgressBarModule,
    TruncatePipe,
    CommonModule,
    TagModule,
    TooltipModule,
    InputNumberModule,
    TimelineModule,
    SkeletonModule,
    TruncateAddressPipe,
    SanitizedHtmlPipe,
    AvatarComponent,
    ConnectWalletComponent,
    ChartModule,
    DynamicDialogModule,
    ToastModule,
    InputTextareaModule,
    DividerModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule,
    ConfirmPopupModule,
    TableModule,
  ],
})
export class SharedModule {}
