import { Injectable } from '@nestjs/common';
import { CreateDrawResultDto } from './dto/create-draw-result.dto';
import { UpdateDrawResultDto } from './dto/update-draw-result.dto';
import { DrawResult } from './entities/draw-result.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class DrawResultsService {
  private resultRepository;
  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(DrawResult)
  }

  async create(data) {
    const result = this.resultRepository.create(data);
    const forUpdate =  await this.resultRepository.insert(result);
    return forUpdate;
  }

  async getLastSequenceId() {
    const data = await this.resultRepository.find({
      select: { id: true },
      order: { idx: "DESC" },
      take: 1
    });

    return data;
  }

  findAll() {
    return `Retireve all drawResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} drawResult`;
  }

  update(id: number, updateDrawResultDto: UpdateDrawResultDto) {
    return `This action updates a #${id} drawResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} drawResult`;
  }
}
