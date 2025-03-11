import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/instructor')
  async signupInstructor(@Body() instructor: CreateInstructorDto) {
    return this.authService.signupInstructor(instructor);
  }

  @Post('signup/student')
  async signupStudent(@Body() student: CreateStudentDto) {
    return this.authService.signupStudent(student);
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }
}
