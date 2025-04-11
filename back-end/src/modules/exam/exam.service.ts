import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto, instructorId?: number): Promise<Exam> {
    try {
      const examData = instructorId
        ? { ...createExamDto, instructorId }
        : createExamDto;

      const exam = this.examRepository.create(examData);
      return await this.examRepository.save(exam);
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  async findAll(): Promise<Exam[]> {
    return await this.examRepository.find();
  }

  async findByInstructor(instructorId: number): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { instructorId }
    });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id }
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto, instructorId?: number): Promise<Exam> {
    try {
      const exam = await this.examRepository.findOne({ where: { id } });

      if (!exam) {
        throw new NotFoundException(`Exam with ID ${id} not found`);
      }

      if (instructorId && exam.instructorId !== instructorId) {
        throw new ForbiddenException('Not authorized to update this exam');
      }

      const updatedExam = this.examRepository.merge(exam, updateExamDto);
      return await this.examRepository.save(updatedExam);
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  }

  async publish(id: number): Promise<Exam> {
    const exam = await this.findOne(id);
    exam.publishedAt = new Date();
    return await this.examRepository.save(exam);
  }

  async remove(id: number, instructorId?: number): Promise<void> {
    try {
      const exam = await this.examRepository.findOne({ where: { id } });

      if (!exam) {
        throw new NotFoundException(`Exam with ID ${id} not found`);
      }

      if (instructorId && exam.instructorId !== instructorId) {
        throw new ForbiddenException('Not authorized to delete this exam');
      }

      await this.examRepository.remove(exam);
    } catch (error) {
      console.error('Error removing exam:', error);
      throw error;
    }
  }
}
