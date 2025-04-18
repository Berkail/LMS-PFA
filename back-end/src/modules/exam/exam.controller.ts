import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ExamsService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AuthGuard, RolesGuard } from 'src/core/auth/guards';
import { Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';

const storage = diskStorage({
  destination: './uploads/exams',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post(':id/create')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  async create(
    @Param('id', ParseIntPipe) instructorId: number,
    @Body() createExamDto: CreateExamDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      if (file) {
        createExamDto.pdfPath = file.path;
        createExamDto.pdfName = file.originalname;
      }

      const exam = await this.examsService.create(createExamDto, instructorId);
      return {
        message: 'Exam created successfully',
        data: exam
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to create exam',
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll(@Query('instructorId') instructorId?: string) {
    try {
      const exams = instructorId
        ? await this.examsService.findByInstructor(+instructorId)
        : await this.examsService.findAll();

      return { data: exams };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch exams',
          message: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const exam = await this.examsService.findOne(id);
      return { data: exam };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Exam not found',
          message: error.message
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/update')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      if (file) {
        updateExamDto.pdfPath = file.path;
        updateExamDto.pdfName = file.originalname;
      }

      const exam = await this.examsService.update(id, updateExamDto);
      return {
        message: 'Exam updated successfully',
        data: exam
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update exam',
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/publish')
  async publish(@Param('id', ParseIntPipe) id: number) {
    try {
      const exam = await this.examsService.publish(id);
      return {
        message: 'Exam published successfully',
        data: exam
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to publish exam',
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.examsService.remove(id);
      return {
        message: 'Exam deleted successfully'
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to delete exam',
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
