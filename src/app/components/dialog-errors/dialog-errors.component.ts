import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogErrors } from '../../types/dialog';

@Component({
  selector: 'app-dialog-errors',
  imports: [ MatDialogModule, MatButtonModule ],
  templateUrl: './dialog-errors.component.html',
  styleUrl: './dialog-errors.component.css'
})
export class DialogErrorsComponent {
  readonly data = inject<DialogErrors>(MAT_DIALOG_DATA);

  constructor(
    private readonly dialogRef: MatDialogRef<DialogErrorsComponent>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
