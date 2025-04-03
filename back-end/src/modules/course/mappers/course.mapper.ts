import { CourseElementMapper } from 'src/modules/course-element/mappers/course-element.mapper';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Course } from '../entities/course.entity';

export class CourseMapper extends CourseElementMapper {
  toEntity(entity: Course, dto: Partial<CreateCourseDto>) {
    entity = entity ?? new Course();
    if (dto.pathToImg) entity.pathToImg = dto.pathToImg;
    if (dto.level) entity.level = dto.level;

    return entity;
  }
}
