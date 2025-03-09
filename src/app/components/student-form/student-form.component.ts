import { ChangeDetectionStrategy, Component, effect, Input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask"
import { StudentService } from '../../services/student.service';
import { StudentsStateService } from '../../services/students-state.service';
import { ApiResponseError } from '../../types/api.types';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorsComponent } from '../dialog-errors/dialog-errors.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageCardComponent } from "../message-card/message-card.component";
import { MessageCardOptions } from '../../types/message-card.types';
import { StudentModel } from '../../models/StudentModel';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatIconModule, NgxMaskDirective, MessageCardComponent],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isUpdatingStudent = signal(false);
  messageCardOptions = signal<MessageCardOptions | null>(null);

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
    const studentToSave = StudentModel.formToModel(this.studentForm.value)
    this.studentService.saveStudent(studentToSave).subscribe({
      next: () => this.saveStudentSuccess(studentToSave.name!),
      error: (err: HttpErrorResponse) => this.saveStudentFailure(err)
    })
  }

  saveStudentSuccess(studentName: string) {
    this.studentStateService.emitRefreshStudents()
    this.messageCardOptions.set({
      type: "success",
      title: `Aluno ${studentName} Salvo com sucesso`
    })
    this.studentForm.reset();
  }

  saveStudentFailure(err: HttpErrorResponse) {
    if(err.status == 0)
      return this.openDialogErrors("Erro ao adicionar aluno", ["Sem conexão com o servidor"])
    this.messageCardOptions.set({
      type: "error",
      title: `Falha ao Salvar aluno`,
      errors: (err.error as ApiResponseError).errors
    })
  }

  openDialogErrors(title: string, errors: string[]) {
    this.matDialog.closeAll()
    this.matDialog.open(DialogErrorsComponent, {
      data: { title, errors },
    });
  }

  updateStudent() {
    const studentToUpdate = StudentModel.formToModel(this.studentForm.value)
    this.studentService.updateStudent(studentToUpdate).subscribe({
      next: () => this.updateStudentSuccess(studentToUpdate.name!),
      error: (err: HttpErrorResponse) => this.updateStudentFailure(err)
    })
  }

  updateStudentSuccess(studentName: string) {
    this.studentStateService.emitRefreshStudents()
    this.cancelUpdating()
    this.messageCardOptions.set({
      type: "success",
      title: `Aluno ${studentName} Atualizado com sucesso`
    })
  }

  updateStudentFailure(err: HttpErrorResponse) {
    if(err.status == 0)
      return this.openDialogErrors("Erro ao atualizar aluno", ["Sem conexão com o servidor"])
    this.messageCardOptions.set({
      type: "error",
      title: `Falha ao Atualizar aluno`,
      errors: (err.error as ApiResponseError).errors
    })
  }

  cancelUpdating() {
    this.studentStateService.clearStudentToUpdate()
    this.isUpdatingStudent.set(false)
    this.studentForm.reset()
  }

  instanceStudentForm() {
    this.studentForm = this.formBuilder.group({
      id: [""],
      name: [ "", Validators.required ],
      email: ["", [ Validators.required, Validators.email ]],
      phoneNumber: ["", Validators.pattern(/^\(\d{2}\) \d{4}-\d{4}$/)],
      cellPhoneNumber: ["" , Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)],
      cpf: ["", Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)],
      birthDate: ["", Validators.pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)]
    })
  }
}
