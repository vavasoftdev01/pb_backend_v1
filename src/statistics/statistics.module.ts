import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsGateway } from './statistics.gateway';
import { DrawResultsService } from '../draw-results/draw-results.service';

@Module({
  providers: [StatisticsGateway, StatisticsService, DrawResultsService],
})
export class StatisticsModule {}
