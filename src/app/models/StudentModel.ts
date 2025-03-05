export class StudentModel {
  constructor(
    public id?: string,
    public name?: string,
    public email?: string,
    public phoneNumber?: string,
    public cellPhoneNumber?: string,
    public cpf?: string,
    public birthDate?: Date
  ) {}
}
