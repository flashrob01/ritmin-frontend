import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
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
import { TokenNumber } from './pipes/tokenNumber.pipe';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    TruncatePipe,
    TruncateAddressPipe,
    SanitizedHtmlPipe,
    AvatarComponent,
    ConnectWalletComponent,
    TokenNumber,
    ProjectCardComponent,
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
    RouterModule,
    DialogModule,
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
    ProjectCardComponent,
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
    TokenNumber,
    RouterModule,
    DialogModule,
  ],
  providers: [DecimalPipe],
})
export class SharedModule {}
