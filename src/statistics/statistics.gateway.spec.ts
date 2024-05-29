import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsGateway } from './statistics.gateway';
import { StatisticsService } from './statistics.service';

describe('StatisticsGateway', () => {
  let gateway: StatisticsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticsGateway, StatisticsService],
    }).compile();

    gateway = module.get<StatisticsGateway>(StatisticsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
