import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ModuleBadgeService } from './module-badge.service';
import { CreateModuleBadgeDto } from './dto/create-module-badge.dto';
import { UpdateModuleBadgeDto } from './dto/update-module-badge.dto';

@Controller('module-badges')
export class ModuleBadgeController {
  constructor(private readonly moduleBadgeService: ModuleBadgeService) {}

  @Post()
  create(@Body() createModuleBadgeDto: CreateModuleBadgeDto) {
    return this.moduleBadgeService.create(createModuleBadgeDto);
  }

  @Get()
  findAll() {
    return this.moduleBadgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleBadgeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleBadgeDto: UpdateModuleBadgeDto) {
    return this.moduleBadgeService.update(+id, updateModuleBadgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleBadgeService.remove(+id);
  }

  @Post(':id/assign-to-module/:moduleId')
  assignToModule(
    @Param('id') id: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.moduleBadgeService.assignToModule(+id, +moduleId);
  }

  @Post(':id/assign-learner/:learnerId')
  assignLearner(
    @Param('id') id: string,
    @Param('learnerId') learnerId: string,
  ) {
    return this.moduleBadgeService.assignLearner(+id, +learnerId);
  }
}