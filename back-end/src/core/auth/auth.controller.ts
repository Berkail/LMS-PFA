import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateInstructorDto } from 'src/modules/instructor/dto/create-instructor.dto';
import { CreateLearnerDto } from 'src/modules/learner/dto/create-learner.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/instructor')
  @ApiOperation({ summary: 'Sign up an instructor' })
  @ApiResponse({
    status: 201,
    description: 'Instructor signed up successfully',
  })
  async signupInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    const result = await this.authService.signupInstructor(createInstructorDto);
    return { message: 'Instructor signed up successfully', data: result };
  }

  @Post('signup/learner')
  @ApiOperation({ summary: 'Sign up a learner' })
  @ApiResponse({ status: 201, description: 'Learner signed up successfully' })
  async signupLearner(@Body() createLearnerDto: CreateLearnerDto) {
    const result = await this.authService.signupLearner(createLearnerDto);
    return { message: 'Learner signed up successfully', data: result };
  }

  @Post('login/instructor')
  @ApiOperation({ summary: 'Login as an instructor' })
  @ApiResponse({ status: 200, description: 'Login successful' })
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
  @ApiOperation({ summary: 'Login as a learner' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async loginAsLearner(@Req() request: Request, @Body() credentials: LoginDto) {
    const result = await this.authService.loginAsLearner(request, credentials);
    return { message: 'Login successful', data: result };
  }

  @Delete('logout')
  @ApiOperation({ summary: 'Logout the user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      await this.authService.logout(request, response);
      return { message: 'Logout successful' };
    } catch (error) {
      return { message: 'Logout failed', error: error.message };
    }
  }
}
