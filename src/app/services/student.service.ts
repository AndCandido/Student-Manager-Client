import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentModel } from '../models/StudentModel';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private static studentUrl = environment.api.url + "/students";

  constructor(
    private readonly http: HttpClient
  ) { }

  saveStudent(student: StudentModel) {
    return this.http.post<StudentModel>(StudentService.studentUrl, student)
  }

  updateStudent(student: StudentModel) {
    return this.http.put<StudentModel>(`${StudentService.studentUrl}/${student.id}`, student)
  }

  getAllStudents(): Observable<StudentModel[]> {
    return this.http.get<StudentModel[]>(StudentService.studentUrl);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${StudentService.studentUrl}/${id}`);
  }
}
