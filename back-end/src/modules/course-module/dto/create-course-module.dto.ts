import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateCourseElementDto } from 'src/modules/course-element/dto/create-course-element.dto';

export class CreateCourseModuleDto extends CreateCourseElementDto {
  @IsNotEmpty()
  @IsInt()
  order: number;
}
