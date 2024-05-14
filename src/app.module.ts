import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsModule } from './results/results.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ResultsModule,
    TypeOrmModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
