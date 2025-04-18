import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  

  @IsOptional()
  publishedAt?: Date;

  @IsOptional()
  file?: Express.Multer.File;

  // Add these fields to handle file modifications
  @IsOptional()
  @IsString()
  pdfPath?: string;

  @IsOptional()
  @IsString()
  pdfName?: string;
}