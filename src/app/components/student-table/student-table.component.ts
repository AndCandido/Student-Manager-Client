import { AfterViewInit, Component, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentModel } from '../../models/StudentModel';
import { StudentService } from '../../services/student.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentsStateService } from '../../services/students-state.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorsComponent } from '../dialog-errors/dialog-errors.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule ],
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.css'
})
export class StudentTableComponent implements OnInit, AfterViewInit {
  studentsData: WritableSignal<MatTableDataSource<StudentModel>> = signal(new MatTableDataSource());
  displayedColumns!: string[];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.studentsData().sort = this.sort;
    this.studentsData().paginator = this.paginator;
  }

  constructor(
    private readonly studentService: StudentService,
    private readonly studentStateService: StudentsStateService,
    private readonly matDialog: MatDialog
  ) {
    this.displayedColumns = [
      "name", "email", "cellPhoneNumber", "phoneNumber", "cpf", "birthDate", "actions"
    ]
  }

  ngOnInit(): void {
    this.refrashStudentsData()
    this.studentStateService.refreshStudentsListEvent.subscribe(() => {
      this.refrashStudentsData();
    })
  }

  applyFilter(event: Event) {
    let value = (event.target as HTMLInputElement).value
    value = value.trim();
    value = value.toLowerCase();
    this.studentsData().filter = value;
  }

  updateStudent(student: StudentModel) {
    this.studentStateService.setStudentToUpdate(student);
  }

  deleteStudent(id: string) {
    const deleteConfirmed = window.confirm("Tem certeza que deseja excluir esse aluno?")
    if(deleteConfirmed) this.studentService.deleteStudent(id).subscribe({
      complete: () => this.refrashStudentsData(),
      error: (err: HttpErrorResponse) => {
        if(err.status == 0) this.openDialogNoConnectionServerError()
      },
    });
  }

  refrashStudentsData() {
    this.studentService.getAllStudents().subscribe({
      next: (value) => this.studentsData().data = value,
      error: () => this.openDialogNoConnectionServerError()
    })
  }

  openDialogNoConnectionServerError() {
    this.openDialogErrors("Erro ao conectar com o servidor", ["Sem conexão com o servidor"])
  }

  openDialogErrors(title: string, errors: string[]) {
    this.matDialog.closeAll()
    this.matDialog.open(DialogErrorsComponent, {
      data: { title, errors },
    });
  }

  isRowUpdating(row: StudentModel) {
    return this.studentStateService.studentToUpdate().id === row.id;
  }
}
