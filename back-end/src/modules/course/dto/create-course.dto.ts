import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateCourseElementDto } from 'src/modules/course-element/dto/create-course-element.dto';
import { CourseDifficulty } from '../enums/course-difficulty.enum';

export class CreateCourseDto extends CreateCourseElementDto {
  @IsOptional()
  @IsString()
  description?: string;
  
  @IsOptional()
  @IsString()
  pathToImg?: string;

  @IsEnum(CourseDifficulty)
  difficulty: CourseDifficulty;
}
