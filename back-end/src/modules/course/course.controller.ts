import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/core/file-upload/file-upload.service';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { MAX_IMG_SIZE } from 'src/core/common/const/lms.const';
import { CourseDifficulty } from './enums/course-difficulty.enum';
import { CreateCourseModuleDto } from '../course-module/dto/create-course-module.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('courses')
@UseGuards(AuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('difficulties')
  @ApiOperation({ summary: 'Get list of course difficulty levels' })
  getCourseDifficulties() {
    return Object.values(CourseDifficulty);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination' })
  async findAllCourses(@Paginate() query: PaginateQuery) {
    return await this.courseService.findAllCourses(query);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: FileUploadService.getImageStorage(),
      fileFilter: FileUploadService.getImageFilter(),
      limits: { fileSize: MAX_IMG_SIZE },
    }),
  )
  async create(
    @CurrentUser() instructor: UserSessionDto,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.create(instructor.id, createCourseDto, file);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post(':courseId/course-modules')
  @ApiOperation({ summary: 'Create a module inside a course' })
  @ApiParam({ name: 'courseId', type: Number })
  async createCourseModule(
    @CurrentUser() instructor: UserSessionDto,
    @Param('courseId') courseId: number,
    @Body() createCourseModuleDto: CreateCourseModuleDto,
  ) {
    return await this.courseService.createCourseModule(courseId, instructor.id, createCourseModuleDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.LEARNER)
  @Post(':courseId/enrollments')
  @ApiOperation({ summary: 'Enroll a learner in a course' })
  @ApiParam({ name: 'courseId', type: Number })
  async enrollLearner(
    @Param('courseId') courseId: string,
    @CurrentUser() learner: UserSessionDto,
  ) {
    const enrollTime = new Date();
    return this.courseService.enrollLearner(+courseId, learner.id, enrollTime);
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiParam({ name: 'courseId', type: Number })
  async findCourseById(@Param('courseId') courseId: string) {
    return await this.courseService.findCourseById(+courseId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Get(':courseId/enrollments')
  @ApiOperation({ summary: 'Get enrollments for a course' })
  @ApiParam({ name: 'courseId', type: Number })
  async findCourseEnrollments(
    @CurrentUser() instructor: UserSessionDto,
    @Param('courseId') courseId: string,
    @Paginate() query: PaginateQuery,
  ) {
    return this.courseService.findCourseEnrollments(+courseId, instructor.id, query);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch(':courseId')
  @ApiOperation({ summary: 'Update a course by ID' })
  @ApiParam({ name: 'courseId', type: Number })
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: FileUploadService.getImageStorage(),
      fileFilter: FileUploadService.getImageFilter(),
      limits: { fileSize: MAX_IMG_SIZE },
    }),
  )
  async updateCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() instructor: UserSessionDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.updateCourse(
      +courseId,
      instructor.id,
      updateCourseDto,
      file,
    );
  }

  @Patch(':courseId/publish')
  @ApiOperation({ summary: 'Publish a course' })
  @ApiParam({ name: 'courseId', type: Number })
  async publish(
    @CurrentUser() instructor: UserSessionDto,
    @Param('courseId') courseId: string,
  ) {
    const publishTime: Date = new Date();
    return await this.courseService.publish(instructor.id, +courseId, publishTime);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':courseId')
  @ApiOperation({ summary: 'Delete a course by ID' })
  @ApiParam({ name: 'courseId', type: Number })
  async remove(
    @Param('courseId') courseId: string,
    @CurrentUser() instructor: UserSessionDto,
  ) {
    return this.courseService.remove(+courseId, instructor.id);
  }
}
