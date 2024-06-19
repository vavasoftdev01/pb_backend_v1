import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsModule } from './results/results.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { GametimerModule } from './gametimer/gametimer.module';
import { DrawResultsModule } from './draw-results/draw-results.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StatisticsModule } from './statistics/statistics.module';
import { ResultsSocketModule } from './results-socket/results-socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ResultsModule,
    TypeOrmModule,
    GametimerModule,
    DrawResultsModule,
    StatisticsModule,
    ResultsSocketModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
