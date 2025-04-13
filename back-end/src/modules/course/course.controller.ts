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

@UseGuards(AuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // -------------------------------------------------------------------
  // 🔵 STATIC ROUTES
  // -------------------------------------------------------------------
  @Get('difficulties')
  getCourseDifficulties() {
    return Object.values(CourseDifficulty);
  }

  @Get()
  async findAllCourses(@Paginate() query: PaginateQuery) {
    return await this.courseService.findAllCourses(query);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post(':id/course-modules')
  async createCourseModule(
    @CurrentUser() instructor,
    @Param('id') courseId: number,
    @Body() createCourseModuleDto: CreateCourseModuleDto,
  ) {
    return await this.courseService.createCourseModule(courseId, instructor.id, createCourseModuleDto);
  }

  @Get(':id')
  async findCourseById(@Param('id') courseId: string) {
    return await this.courseService.findCourseById(+courseId);
  }

  // -------------------------------------------------------------------
  // 🟢 CREATE
  // -------------------------------------------------------------------
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post()
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
  @Roles(UserRole.LEARNER)
  @Post(':id/enrollments')
  async enrollLearner(
    @Param('id') courseId: string,
    @CurrentUser() learner: UserSessionDto,
  ) {
    const enrollTime = new Date();
    return this.courseService.enrollLearner(+courseId, learner.id, enrollTime);
  }

  // -------------------------------------------------------------------
  // 🔵 READ - Enrollment Routes
  // -------------------------------------------------------------------
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Get(':id/enrollments')
  async findCourseEnrollments(
    @CurrentUser() instructor: UserSessionDto,
    @Param('id') courseId: string,
    @Paginate() query: PaginateQuery,
  ) {
    return this.courseService.findCourseEnrollments(
      +courseId,
      instructor.id,
      query,
    );
  }

  // -------------------------------------------------------------------
  // 🟡 UPDATE
  // -------------------------------------------------------------------
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: FileUploadService.getImageStorage(),
      fileFilter: FileUploadService.getImageFilter(),
      limits: { fileSize: MAX_IMG_SIZE },
    }),
  )
  async updateCourse(
    @Param('id') courseId: string,
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

  // -------------------------------------------------------------------
  // 🔴 DELETE
  // -------------------------------------------------------------------
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':id')
  async removeCourse(
    @Param('id') courseId: string,
    @CurrentUser() instructor: UserSessionDto,
  ) {
    return this.courseService.remove(+courseId, instructor.id);
  }
}
