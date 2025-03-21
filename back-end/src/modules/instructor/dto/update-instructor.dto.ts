import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdateInstructorDto {
    
   @IsString()
     @IsNotEmpty()
     readonly firstName?: string;
   
     @IsString()
     @IsNotEmpty()
     readonly lastName?: string;
   
     @IsEmail()
     @IsNotEmpty()
     readonly email?: string;
   
     @IsString()
     @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
       message:
         'Password must be at least 6 characters long, with an uppercase letter, a digit, and a special character.',
     })
     readonly plainPassword?: string;

     @IsString()
     @IsNotEmpty()
     readonly expertise?: string;

  }