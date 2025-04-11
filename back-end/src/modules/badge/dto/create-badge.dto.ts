import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBadgeDto {
 
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsString()
  imageUrl?: string;
  }
  