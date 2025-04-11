import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class CreateModuleBadgeLearnerDto {
  @IsInt()
  @IsNotEmpty()
  learnerId: number;

  @IsInt()
  @IsNotEmpty()
  moduleBadgeId: number;

  @IsDate()
  @IsNotEmpty()
  earnedDate: Date;
}