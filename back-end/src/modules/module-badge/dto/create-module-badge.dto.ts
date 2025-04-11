import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CourseModule } from "src/modules/course-module/entities/course-module.entity";
import { Learner } from "src/modules/learner/entities/learner.entity";

export class CreateModuleBadgeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  imageUrl?: string;

}
