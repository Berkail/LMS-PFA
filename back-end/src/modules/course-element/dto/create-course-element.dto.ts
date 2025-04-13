import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseElementDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
