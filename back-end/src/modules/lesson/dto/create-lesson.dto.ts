import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCourseElementDto } from 'src/modules/course-element/dto/create-course-element.dto';

export class CreateLessonDto extends CreateCourseElementDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'URL or path to the video of the lesson',
    example: 'https://example.com/lesson-video.mp4',
  })
  pathToUrlVid: string;
}
