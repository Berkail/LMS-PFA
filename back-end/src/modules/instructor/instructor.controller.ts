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
import { InstructorService } from './instructor.service';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { UserRole } from '../user/enums/user-role.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all instructors with pagination' })
  @ApiResponse({ status: 200, description: 'Returns a list of instructors' })
  async findAll(@Paginate() query: PaginateQuery) {
    return this.instructorService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch('/me')
  @ApiOperation({ summary: 'Update instructor details' })
  @ApiResponse({ status: 200, description: 'Instructor details updated successfully' })
  async update(
    @CurrentUser() instructor: UserSessionDto,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return await this.instructorService.update(instructor.id, updateInstructorDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete('/me')
  @ApiOperation({ summary: 'Delete instructor account' })
  @ApiResponse({ status: 200, description: 'Instructor account deleted successfully' })
  async remove(@CurrentUser() instructor: UserSessionDto) {
    return await this.instructorService.remove(instructor.id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Get('/me')
  @ApiOperation({ summary: 'Get current instructor details' })
  @ApiResponse({ status: 200, description: 'Returns the instructor details' })
  async findMe(@CurrentUser() instructor: UserSessionDto) {
    return await this.instructorService.findById(instructor.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get instructor details by ID' })
  @ApiResponse({ status: 200, description: 'Returns the instructor details by ID' })
  async findById(@Param('id') id: string) {
    return await this.instructorService.findById(+id);
  }
}
