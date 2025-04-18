import { CourseElementMapper } from 'src/modules/course-element/mappers/course-element.mapper';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Course } from '../entities/course.entity';

export class CourseMapper extends CourseElementMapper {
  toEntity(entity: Course, dto: Partial<CreateCourseDto>): Course {
    entity = entity ?? new Course();
    entity = super.toEntity(entity, dto) as Course;
    if (dto.description) entity.description = dto.description;
    if (dto.difficulty) entity.difficulty = dto.difficulty;
    if (dto.pathToImg) entity.pathToImg = dto.pathToImg;
    return entity;
  }
}
