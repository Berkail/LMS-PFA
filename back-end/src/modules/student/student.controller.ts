import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';


@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // CREATE
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  // FIND ALL
  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  // FIND ONE
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.studentService.findOne(+id);
  }

  // UPDATE
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.studentService.remove(+id);
  }
}