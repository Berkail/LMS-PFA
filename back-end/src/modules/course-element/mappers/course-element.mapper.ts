import { CreateCourseElementDto } from '../dto/create-course-element.dto';
import { CourseElement } from '../entities/course-element.entity';
import { capitalize } from 'src/core/common/utils/func/capitalize.func';

export class CourseElementMapper {
  toEntity(entity: CourseElement, dto: Partial<CreateCourseElementDto>) {
    if (dto.title) entity.title = capitalize(dto.title);
    if (dto.description) entity.description = dto.description;
  }
}
