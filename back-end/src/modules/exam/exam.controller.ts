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
import { CurrentUser, Roles } from 'src/core/auth/decorators';
import { UserRole } from '../user/enums/user-role.enum';
import { UserSessionDto } from 'src/core/auth/dto/user-session.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

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

@ApiTags('exams')
@UseGuards(AuthGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post()
  @ApiOperation({ summary: 'Create a new exam' })
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  async create(
    @CurrentUser() instructor: UserSessionDto,
    @Body() createExamDto: CreateExamDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      if (file) {
        createExamDto.pdfPath = file.path;
        createExamDto.pdfName = file.originalname;
      }

      const exam = await this.examsService.create(createExamDto, instructor.id);
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
  @ApiOperation({ summary: 'Get all exams with optional instructor filter' })
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
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', type: Number })
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

  @UseGuards(RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Patch(':id')
@ApiOperation({ summary: 'Update an exam by ID' })
@ApiParam({ name: 'id', type: Number })
@UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
async update(
  @Param('id', ParseIntPipe) id: number,  // id is extracted from the URL
  @CurrentUser() instructor: UserSessionDto,
  @Body() updateExamDto: UpdateExamDto,  // update exam data from the body
  @UploadedFile() file: Express.Multer.File
) {
  try {
    // If a new file is uploaded, update the file info in the DTO
    if (file) {
      updateExamDto.pdfPath = file.path;
      updateExamDto.pdfName = file.originalname;
    }

    // Update the exam using the service
    const exam = await this.examsService.update(id, updateExamDto, instructor.id);
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


  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish an exam' })
  @ApiParam({ name: 'id', type: Number })
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() instructor: UserSessionDto
  ) {
    try {
      const exam = await this.examsService.publish(id, instructor.id);
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() instructor: UserSessionDto
  ) {
    try {
      await this.examsService.remove(id, instructor.id);
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
