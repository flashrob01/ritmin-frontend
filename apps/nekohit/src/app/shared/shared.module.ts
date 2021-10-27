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

@NgModule({
  declarations: [TruncatePipe],
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
  ],
})
export class SharedModule {}
