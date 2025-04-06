import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateInstructorDto } from 'src/modules/instructor/dto/create-instructor.dto';
import { CreateLearnerDto } from 'src/modules/learner/dto/create-learner.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/instructor')
  async signupInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    const result = await this.authService.signupInstructor(createInstructorDto);
    return { message: 'Instructor signed up successfully', data: result };
  }

  @Post('signup/learner')
  async signupLearner(@Body() createLearnerDto: CreateLearnerDto) {
    const result = await this.authService.signupLearner(createLearnerDto);
    return { message: 'Learner signed up successfully', data: result };
  }

  @Post('login/instructor')
  async loginAsInstructor(
    @Req() request: Request,
    @Body() credentials: LoginDto,
  ) {
    const result = await this.authService.loginAsInstructor(
      request,
      credentials,
    );
    return { message: 'Login successful', data: result };
  }

  @Post('login/learner')
  async loginAsLearner(@Req() request: Request, @Body() credentials: LoginDto) {
    const result = await this.authService.loginAsLearner(request, credentials);
    return { message: 'Login successful', data: result };
  }

  @Delete('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    try {
      await this.authService.logout(request, response);
      return { message: 'Logout successful' };
    } catch (error) {
      return { message: 'Logout failed', error: error.message };
    }
  }
}
