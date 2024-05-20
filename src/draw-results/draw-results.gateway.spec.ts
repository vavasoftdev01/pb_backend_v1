import { Test, TestingModule } from '@nestjs/testing';
import { DrawResultsGateway } from './draw-results.gateway';
import { DrawResultsService } from './draw-results.service';

describe('DrawResultsGateway', () => {
  let gateway: DrawResultsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawResultsGateway, DrawResultsService],
    }).compile();

    gateway = module.get<DrawResultsGateway>(DrawResultsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
