import { Injectable } from '@nestjs/common';
import { DataSource  } from 'typeorm';
import { DrawResultsService as StatService } from '../draw-results/draw-results.service';
import * as moment from 'moment-timezone';

@Injectable()
export class StatisticsService {

  constructor(private readonly statService: StatService) {}

  async findAll(filters) {
    const results = await this.statService.getStatistics(filters);
    return results;
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
