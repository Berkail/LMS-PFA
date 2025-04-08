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
import { Request } from 'express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/core/file-upload/file-upload.service';

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
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Req() req: Request,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.create(req, createCourseDto, file);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.courseService.findById(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @UseInterceptors(
    FileInterceptor('courseImg', {
      storage: FileUploadService.getImageStorage(),
      fileFilter: FileUploadService.getImageFilter(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.update(+id, updateCourseDto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
