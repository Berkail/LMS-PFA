import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { EnrollmentStatus } from './enums/enrollement-status.enum';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get('status')
  getStatus() {
    return Object.values(EnrollmentStatus);
  }
}
