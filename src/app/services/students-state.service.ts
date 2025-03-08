import { EventEmitter, Injectable, signal } from '@angular/core';
import { StudentModel } from '../models/StudentModel';

@Injectable({
  providedIn: 'root'
})
export class StudentsStateService {
  public studentsList = signal<StudentModel[]>([])
  public studentToUpdate = signal<StudentModel>(new StudentModel())
  public refreshStudentsListEvent = new EventEmitter()

  constructor() { }

  setStudentToUpdate(studentToUpdate: StudentModel) {
    this.studentToUpdate.set(studentToUpdate);
  }

  clearStudentToUpdate() {
    this.studentToUpdate.set(new StudentModel());
  }

  emitRefreshStudents() {
    this.refreshStudentsListEvent.emit();
  }
}
