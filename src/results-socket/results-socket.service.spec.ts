import { Test, TestingModule } from '@nestjs/testing';
import { ResultsSocketService } from './results-socket.service';

describe('ResultsSocketService', () => {
  let service: ResultsSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultsSocketService],
    }).compile();

    service = module.get<ResultsSocketService>(ResultsSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
