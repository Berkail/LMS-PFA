import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { Repository } from 'typeorm';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // CREATE
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(student);
  }

  // FIND ALL
  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find();
  }

  // FIND ONE
  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return student;
  }

  // UPDATE
  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    await this.studentRepository.update(id, updateStudentDto);
    const updatedStudent = await this.studentRepository.findOne({ where: { id } });
    if (!updatedStudent) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return updatedStudent;
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
  }
}