import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
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

@UseGuards(AuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard, RolesGuard)
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

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.courseService.findAll(query);
  }

  @Get('difficulties')
  getDifficulties() {
    return Object.values(CourseDifficulty);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Get(':id/enrollments')
  async findEnrollments(
    @CurrentUser() instructor: UserSessionDto,
    @Param('id') courseId: number,
    @Paginate() query: PaginateQuery,
  ) {
    return this.courseService.findEnrollments(instructor.id, courseId, query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.courseService.findById(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: FileUploadService.getImageStorage(),
      fileFilter: FileUploadService.getImageFilter(),
      limits: { fileSize: MAX_IMG_SIZE },
    }),
  )
  @Patch(':id')
  async update(
    @Param('id') courseId: string,
    @CurrentUser() instructor: UserSessionDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.update(
      +courseId,
      instructor.id,
      updateCourseDto,
      file,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':id')
  remove(
    @Param('id') courseId: string,
    @CurrentUser() insturctor: UserSessionDto,
  ) {
    return this.courseService.removeCourse(+courseId, insturctor.id);
  }
}
