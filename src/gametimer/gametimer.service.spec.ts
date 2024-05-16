import { Test, TestingModule } from '@nestjs/testing';
import { GametimerService } from './gametimer.service';

describe('GametimerService', () => {
  let service: GametimerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GametimerService],
    }).compile();

    service = module.get<GametimerService>(GametimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
