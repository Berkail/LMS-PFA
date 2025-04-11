import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsOptional()
  publishedAt?: Date;
}