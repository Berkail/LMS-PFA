import { Controller, Get, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { EnrollmentStatus } from './enums/enrollement-status.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get enrollment status values' })
  getStatus() {
    return Object.values(EnrollmentStatus);
  }
}
