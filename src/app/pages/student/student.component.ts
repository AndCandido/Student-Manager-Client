import { Component } from '@angular/core';
import { StudentFormComponent } from "../../components/student-form/student-form.component";
import { StudentTableComponent } from "../../components/student-table/student-table.component";

@Component({
  selector: 'app-student',
  imports: [StudentFormComponent, StudentTableComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {

}
