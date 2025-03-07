import { Component, signal, WritableSignal } from '@angular/core';
import { StudentFormComponent } from "../../components/student-form/student-form.component";
import { StudentTableComponent } from "../../components/student-table/student-table.component";
import { StudentModel } from '../../models/StudentModel';

@Component({
  selector: 'app-student',
  imports: [StudentFormComponent, StudentTableComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
}
