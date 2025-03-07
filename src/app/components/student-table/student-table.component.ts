import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StudentModel } from '../../models/StudentModel';
import { StudentService } from '../../services/student.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentsStateService } from '../../services/students-state.service';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.css'
})
export class StudentTableComponent implements OnInit {
  studentsData: WritableSignal<StudentModel[]> = signal([]);
  displayedColumns!: string[];

  constructor(
    private readonly studentService: StudentService,
    private readonly studentStateService: StudentsStateService
  ) {
    this.displayedColumns = [
      "name",
      "email",
      "cellPhoneNumber",
      "phoneNumber",
      "cpf",
      "birthDate",
      "actions"
    ]
  }

  ngOnInit(): void {
    this.refrashStudentsData()
    this.studentStateService.refreshStudentsListEvent.subscribe(() => {
      this.refrashStudentsData();
    })
  }

  updateStudent(student: StudentModel) {
    this.studentStateService.setStudentToUpdate(student);
  }

  deleteStudent(id: string) {
    const deleteConfirmed = window.confirm("Tem certeza que deseja excluir esse aluno?")
    if(deleteConfirmed) this.studentService.deleteStudent(id).subscribe({
      complete: () => this.refrashStudentsData(),
    });
  }

  refrashStudentsData() {
    this.studentService.getAllStudents().subscribe({
      next: (value) => this.studentsData.set(value),
      error: () => window.alert("Error ao Carregar os Alunos")
    })
  }
}
