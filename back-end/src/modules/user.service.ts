import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity'; 
import { Teacher } from '../entities/teacher.entity'; 

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async findAllStudents(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findAllTeachers(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  async findStudentById(id: number): Promise<Student | null> {
    return this.studentRepository.findOneBy({ userId: id });
  }

  async findTeacherById(id: number): Promise<Teacher | null> {
    return this.teacherRepository.findOneBy({ userId: id });
  }

  async createStudent(studentData: Partial<Student>): Promise<Student> {
    return this.studentRepository.save(studentData);
  }

  async createTeacher(teacherData: Partial<Teacher>): Promise<Teacher> {
    return this.teacherRepository.save(teacherData);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentRepository.delete(id);
  }

  async deleteTeacher(id: number): Promise<void> {
    await this.teacherRepository.delete(id);
  }
}
