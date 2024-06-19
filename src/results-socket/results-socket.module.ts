import { Module } from '@nestjs/common';
import { ResultsSocketService } from './results-socket.service';
import { ResultsSocketGateway } from './results-socket.gateway';

@Module({
  providers: [ResultsSocketGateway, ResultsSocketService],
})
export class ResultsSocketModule {}
