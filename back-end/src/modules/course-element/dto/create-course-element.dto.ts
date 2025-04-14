import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseElementDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Title of the course element',
    type: String,
  })
  title: string;
}
