import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseElementService } from '../course-element/course-element.service';
import { CourseModule } from './entities/course-module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class CourseModuleService extends CourseElementService<CourseModule> {
  constructor(
    @InjectRepository(CourseModule)
    private readonly courseModuleRepo: Repository<CourseModule>,
  ) {
    super(courseModuleRepo);
  }
  create(createCourseModuleDto: CreateCourseModuleDto) {
    return 'This action adds a new courseModule';
  }

  async find(courseModuleId : number){

  }

  update(courseModuleId: number, updateCourseModuleDto: UpdateCourseModuleDto) {
    return `This action updates a #${courseModuleId} courseModule`;
  }

  protected async beforeSoftRemove(courseModule: CourseModule): Promise<void> {

  }
}
