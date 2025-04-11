import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { Badge } from './entities/badge.entity';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
  ) {}

  async create(dto: CreateBadgeDto) {
    const badge = this.badgeRepository.create(dto);
    return await this.badgeRepository.save(badge);
  }

  async findAll() {
    return await this.badgeRepository.find();
  }

  async findOne(id: number) {
    const badge = await this.badgeRepository.findOne({ where: { badgeId: id } });
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
    return badge;
  }

  async update(id: number, dto: UpdateBadgeDto) {
    await this.badgeRepository.update(id, dto);
    return await this.findOne(id); 
  }

  async delete(id: number) {
    const badge = await this.findOne(id);
    return await this.badgeRepository.remove(badge);
  }
}
