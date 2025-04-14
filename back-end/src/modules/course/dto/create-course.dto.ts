import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateCourseElementDto } from 'src/modules/course-element/dto/create-course-element.dto';
import { CourseDifficulty } from '../enums/course-difficulty.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto extends CreateCourseElementDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Description of the course',
    type: String,
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Path to the image representing the course',
    type: String,
    required: false,
  })
  pathToImg?: string;

  @IsEnum(CourseDifficulty)
  @ApiProperty({
    description: 'The difficulty level of the course',
    enum: CourseDifficulty,
  })
  difficulty: CourseDifficulty;
}
