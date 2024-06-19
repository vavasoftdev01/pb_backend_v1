import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ResultsSocketService } from './results-socket.service';
import {Socket, Server} from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'results-socket'
})
export class ResultsSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly resultsSocketService: ResultsSocketService) {}

  @SubscribeMessage('getPaginatedResults')
  async getAllResults(@MessageBody() params: {}) {
    return await this.resultsSocketService.getPaginatedResults(params);
  }

  @SubscribeMessage('findOneResultsSocket')
  findOne(@MessageBody() id: number) {
    return this.resultsSocketService.findOne(id);
  }
}
