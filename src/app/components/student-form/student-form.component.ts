import { ChangeDetectionStrategy, Component, effect, Input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask"
import { StudentService } from '../../services/student.service';
import { StudentsStateService } from '../../services/students-state.service';
import { ApiResponseError } from '../../types/api';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorsComponent } from '../dialog-errors/dialog-errors.component';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentModel } from '../../models/StudentModel';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatIconModule, NgxMaskDirective ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isUpdatingStudent = signal(false);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly studentService: StudentService,
    private readonly studentStateService: StudentsStateService,
    private readonly matDialog: MatDialog
  ) {
    effect(() => {
      const studentToUpdate = this.studentStateService.studentToUpdate()
      if(!studentToUpdate.id) return
      this.studentForm.patchValue(studentToUpdate);
      this.isUpdatingStudent.set(true);
    })
  }

  ngOnInit() {
    this.instanceStudentForm();
  }

  onSubmit() {
    if(this.studentForm.invalid) return;
    if(this.studentForm.get("id")?.value) return this.updateStudent();
    this.saveStudent();
  }

  saveStudent() {
    this.studentService.saveStudent(this.studentForm.value).subscribe({
      next: () => this.studentStateService.emitRefreshStudents(),
      error: (err: HttpErrorResponse) => {
        if(err.status == 0)
          return this.openDialogErrors("Erro ao adicionar aluno", ["Sem conexão com o servidor"])
        this.showErrors(err.error as ApiResponseError)
      }
    })
  }

  showErrors(errors: ApiResponseError) {
    this.openDialogErrors("Erro ao adicionar o Aluno", errors.errors)
  }

  openDialogErrors(title: string, errors: string[]) {
    this.matDialog.closeAll()
    this.matDialog.open(DialogErrorsComponent, {
      data: { title, errors },
    });
  }

  updateStudent() {
    this.studentService.updateStudent(this.studentForm.value).subscribe({
      next: () => {
        this.studentStateService.emitRefreshStudents()
        this.cancelUpdating()
      },
      error: (err: HttpErrorResponse) => {
        if(err.status == 0)
          return this.openDialogErrors("Erro ao atualizar aluno", ["Sem conexão com o servidor"])
        this.showErrors(err.error as ApiResponseError)
      }
    })
  }

  cancelUpdating() {
    this.studentStateService.clearStudentToUpdate()
    this.isUpdatingStudent.set(false)
    this.studentForm.reset()
  }

  instanceStudentForm() {
    this.studentForm = this.formBuilder.group({
      id: [null],
      name: [ null, Validators.required ],
      email: [null, [ Validators.required, Validators.email ]],
      phoneNumber: [null, Validators.pattern(/^\(\d{2}\) \d{4}-\d{4}$/)],
      cellPhoneNumber: [null , Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)],
      cpf: [null, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)],
      birthDate: [null, Validators.pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)]
    })
  }
}
