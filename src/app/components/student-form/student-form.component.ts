import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask"
import { StudentModel } from '../../models/StudentModel';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatIconModule, NgxMaskDirective ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent {
  @Input() formData: StudentModel = new StudentModel();
  studentForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly studentService: StudentService
  ) {
    this.instanceStudentForm();
  }

  onSubmit() {
    if(this.studentForm.invalid) return
    if(this.studentForm.get("id")) return this.updateStudent()
    this.studentService.saveStudent(this.studentForm.value).subscribe()
  }

  updateStudent() {
    this.studentService.updateStudent(this.studentForm.value).subscribe()
  }

  instanceStudentForm() {
    this.studentForm = this.formBuilder.group({
      id: [
        this.formData.id
      ],
      name: [
        this.formData.name,
        Validators.required
      ],
      email: [
        this.formData.email,
        [ Validators.required, Validators.email ]
      ],
      phoneNumber: [
        this.formData.phoneNumber,
        Validators.pattern("^\\(?\\d{2}\\)?\\s?(?:9\\d{4}|\\d{4})-?\\d{4}$")
      ],
      cellPhoneNumber: [
        this.formData.cellPhoneNumber,
        Validators.pattern("^\\(?\\d{2}\\)?\\s?(?:9\\d{4}|\\d{5})-?\\d{4}$")
      ],
      cpf: [
        this.formData.cpf,
        Validators.pattern("^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$")
      ],
      birthDate: [
        this.formData.birthDate,
        Validators.pattern( /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
      ]
    })
  }
}
