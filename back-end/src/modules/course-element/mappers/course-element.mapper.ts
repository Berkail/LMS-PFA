import { CreateCourseElementDto } from '../dto/create-course-element.dto';
import { CourseElement } from '../entities/course-element.entity';
import { capitalize } from 'src/core/common/utils/func/capitalize.func';

export abstract class CourseElementMapper {
  toEntity(entity: CourseElement, dto: Partial<CreateCourseElementDto>) : CourseElement{
    if (dto.title) entity.title = capitalize(dto.title);
    return entity;
  }
}
