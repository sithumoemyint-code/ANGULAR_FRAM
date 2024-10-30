import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdminImgUploadComponent } from 'src/app/modules/custom/admin-img-upload/admin-img-upload.component';

@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, AdminImgUploadComponent, ReactiveFormsModule],
})
export class CreateDataComponent implements OnInit {
  createForm!: FormGroup
  fileName: string | null = null;

  constructor(private _dialogRef: MatDialogRef<CreateDataComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      upload: [''],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType === 'xls' || fileType === 'xlsx') {
        this.fileName = file.name;
      } else {
        alert('Please upload an Excel file (.xls or .xlsx)');
        input.value = '';
      }
    }
  }

  onImageSelected(event: any) {
  }

  removeFile(): void {
    this.fileName = null;
  }

  closeCreate() {
    this._dialogRef.close();
  }

  createData() {
    console.log(this.createForm.value, ' create form')
  }
}