import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.LEARNER)

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}
}

