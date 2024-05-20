import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsModule } from './results/results.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { GametimerModule } from './gametimer/gametimer.module';
import { DrawResultsModule } from './draw-results/draw-results.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ResultsModule,
    TypeOrmModule,
    GametimerModule,
    DrawResultsModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
