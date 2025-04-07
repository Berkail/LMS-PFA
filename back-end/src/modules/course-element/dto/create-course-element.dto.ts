import { IsOptional, IsString } from 'class-validator';

export class CreateCourseElementDto {
  @IsString()
  title: string;
}
