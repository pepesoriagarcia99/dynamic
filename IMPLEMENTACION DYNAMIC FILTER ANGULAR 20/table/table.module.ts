/**
 * @module TableModule
 *
 * Este modulo contiene una implementacion dinamica y configurable de tablas dinamicas con NgPrime y tailwindcss.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** PrimeNG Modules */
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

import { TableModule as NgTableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

/** Module Components */
import { MainTable } from './components/table/main-table';

@NgModule({
  declarations: [
    MainTable
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgTableModule,
    TagModule,
    IconFieldModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    InputTextModule,
    SkeletonModule
  ],
  exports: [
    MainTable
  ]
})
export class TableModule {}
