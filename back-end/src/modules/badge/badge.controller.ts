import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateBadgeDto } from "./dto/create-badge.dto";
import { BadgeService } from "./badge.service";
import { UpdateBadgeDto } from "./dto/update-badge.dto";

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgeService.create(createBadgeDto);
  }

  @Get()
  findAll() {
    return this.badgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.badgeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgeService.update(+id, updateBadgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.badgeService.delete(+id);
  }
}
