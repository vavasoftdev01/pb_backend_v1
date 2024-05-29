import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { StatisticsService } from './statistics.service';
import {Socket, Server} from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'statistics'
})
export class StatisticsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly statisticsService: StatisticsService) {}

  @SubscribeMessage('findAllStatistics')
  async findAll() {
    const data = await this.statisticsService.findAll();
    // this.server.on('get-data', () => {
    //   data
    // });
    return data;
  }

  @SubscribeMessage('findOneStatistic')
  findOne(@MessageBody() id: number) {
    return this.statisticsService.findOne(id);
  }
}
