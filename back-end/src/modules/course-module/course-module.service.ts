import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModule } from './entities/course-module.entity';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class CourseModuleService {
  constructor(
    @InjectRepository(CourseModule)
    private readonly courseModuleRepository: Repository<CourseModule>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

  ) {}

  async create(createCourseModuleDto: CreateCourseModuleDto): Promise<CourseModule> {
    const course = await this.courseRepository.findOne({ where: { id: createCourseModuleDto.courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${createCourseModuleDto.courseId} not found`);
    }

    const courseModule = this.courseModuleRepository.create({
      ...createCourseModuleDto,
      course,
    });
    return this.courseModuleRepository.save(courseModule);
  }

  async findAll(): Promise<CourseModule[]> {
    return this.courseModuleRepository.find({
      relations: ['course'],
    });
  }

  async findOne(id: number): Promise<CourseModule> {
    const module = await this.courseModuleRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!module) {
      throw new NotFoundException(`CourseModule with ID ${id} not found`);
    }
    return module;
  }

  async update(id: number, updateCourseModuleDto: UpdateCourseModuleDto): Promise<CourseModule> {
    const module = await this.findOne(id);

    if (updateCourseModuleDto.courseId) {
      const course = await this.courseRepository.findOne({ where: { id: updateCourseModuleDto.courseId } });
      if (!course) {
        throw new NotFoundException(`Course with ID ${updateCourseModuleDto.courseId} not found`);
      }
      module.course = course;
    }

    const updated = this.courseModuleRepository.merge(module, updateCourseModuleDto);
    return this.courseModuleRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const module = await this.findOne(id);
    await this.courseModuleRepository.remove(module);
  }
}
