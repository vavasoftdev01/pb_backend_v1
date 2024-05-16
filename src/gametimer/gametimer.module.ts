import { Module } from '@nestjs/common';
import { GametimerService } from './gametimer.service';
import { GametimerGateway } from './gametimer.gateway';

@Module({
  providers: [GametimerGateway, GametimerService],
})
export class GametimerModule {}
