import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';

@Injectable()
export class InstructorService  { 
    constructor(
        @InjectRepository(Instructor)
        private instructorRepository: Repository<Instructor>
      ) {}
    
      findAll(): Promise<Instructor[]> {
        return this.instructorRepository.find();
      }
    
      create(instructor: Partial<Instructor>): Promise<Instructor> {
        const newInstructor = this.instructorRepository.create(instructor);
        return this.instructorRepository.save(newInstructor);
      }

}
