import { Module } from '@nestjs/common';
import { DrawResultsService } from './draw-results.service';
import { DrawResultsGateway } from './draw-results.gateway';

@Module({
  providers: [DrawResultsGateway, DrawResultsService],
})
export class DrawResultsModule {}
