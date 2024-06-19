import { Test, TestingModule } from '@nestjs/testing';
import { ResultsSocketGateway } from './results-socket.gateway';
import { ResultsSocketService } from './results-socket.service';

describe('ResultsSocketGateway', () => {
  let gateway: ResultsSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultsSocketGateway, ResultsSocketService],
    }).compile();

    gateway = module.get<ResultsSocketGateway>(ResultsSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
