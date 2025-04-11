import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ModuleBadgeLearnerService } from "./module-badge-learner.service";

@Controller('module-badge-learner')
export class ModuleBadgeLearnerController {
  constructor(private readonly service: ModuleBadgeLearnerService) {}

  @Post()
  async create(
    @Body() data: { learnerId: number; moduleBadgeId: number; earnedDate: Date }
  ) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { learnerId?: number; moduleBadgeId?: number; earnedDate?: Date }
  ) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}