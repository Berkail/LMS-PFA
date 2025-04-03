import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateCourseElementDto } from 'src/modules/course-element/dto/create-course-element.dto';
import { Level } from '../enums/level.enum';

export class CreateCourseDto extends CreateCourseElementDto {
  @IsOptional()
  @IsString()
  pathToImg?: string;

  @IsEnum(Level)
  level: Level;
}
