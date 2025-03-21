import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const instructor = this.instructorRepository.create(createInstructorDto);
    return await this.instructorRepository.save(instructor);
  }

  async findAll(): Promise<Instructor[]> {
    return await this.instructorRepository.find();
  }

  async findOne(id: number): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({ where: { id } });
    if (!instructor) {
      throw new NotFoundException(`Instructor with id ${id} not found`);
    }
    return instructor;
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {
    await this.instructorRepository.update(id, updateInstructorDto);
    const updatedInstructor = await this.instructorRepository.findOne({ where: { id } });
    if (!updatedInstructor) {
      throw new NotFoundException(`Instructor with id ${id} not found`);
    }
    return updatedInstructor;
  }

  
  async remove(id: number): Promise<void> {
    const result = await this.instructorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Instructor with id ${id} not found`);
    }
  }
}

