import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto } from './create-exam.dto';
import { Express } from 'express';

export class UpdateExamDto extends PartialType(CreateExamDto) {

    @IsNotEmpty()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

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