import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseElementDto } from './create-course-element.dto';

export class UpdateCourseElementDto extends PartialType(CreateCourseElementDto) {}
