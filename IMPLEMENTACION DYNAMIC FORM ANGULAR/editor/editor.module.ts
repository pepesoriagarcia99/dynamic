import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AttachmentUploaderModule } from '../attachment-uploader/attachment-uploader.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoreModule, MatFormFieldModule, MatInputModule, AttachmentUploaderModule],
  exports: []
})
export class EditorModule {}
