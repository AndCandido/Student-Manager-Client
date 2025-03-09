import { normalizeString } from "../utils/normalize-string.utils";

export class StudentModel {
  constructor(
    public id?: string,
    public name?: string,
    public email?: string,
    public phoneNumber?: string,
    public cellPhoneNumber?: string,
    public cpf?: string | null,
    public birthDate?: Date
  ) {
    this.id = normalizeString(id);
    this.name = normalizeString(name);
    this.email = normalizeString(email);
    this.phoneNumber = normalizeString(phoneNumber);
    this.cellPhoneNumber = normalizeString(cellPhoneNumber);
    this.cpf = normalizeString(cpf);
    this.birthDate = birthDate;
  }

  static formToModel(student: StudentModel): StudentModel {
    return new StudentModel(
      normalizeString(student.id),
      normalizeString(student.name),
      normalizeString(student.email),
      normalizeString(student.phoneNumber),
      normalizeString(student.cellPhoneNumber),
      normalizeString(student.cpf),
      student.birthDate
    );
  }
}
