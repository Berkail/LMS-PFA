import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateCourseElementDto } from 'src/modules/course-element/dto/create-course-element.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseModuleDto extends CreateCourseElementDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Order of the course module in the course structure',
    type: Number,
  })
  order: number;
}
