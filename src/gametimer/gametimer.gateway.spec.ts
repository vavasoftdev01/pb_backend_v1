import { Test, TestingModule } from '@nestjs/testing';
import { GametimerGateway } from './gametimer.gateway';
import { GametimerService } from './gametimer.service';

describe('GametimerGateway', () => {
  let gateway: GametimerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GametimerGateway, GametimerService],
    }).compile();

    gateway = module.get<GametimerGateway>(GametimerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
