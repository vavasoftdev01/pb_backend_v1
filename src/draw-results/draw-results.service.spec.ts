import { Test, TestingModule } from '@nestjs/testing';
import { DrawResultsService } from './draw-results.service';

describe('DrawResultsService', () => {
  let service: DrawResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawResultsService],
    }).compile();

    service = module.get<DrawResultsService>(DrawResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
