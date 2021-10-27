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
  ],
})
export class SharedModule {}
