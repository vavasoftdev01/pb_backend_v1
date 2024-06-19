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
    const total = await this.resultsSocketService.getAllResults();
    const results = await this.resultsSocketService.getPaginatedResults(params);

    return {
      'limit': params['limit'],
      'offset': params['offset'],
      'total_results': (total) ? Math.ceil(total / params['limit']) : 0,
      'results': (results) ? results: []
    }
    
  }

  @SubscribeMessage('findOneResultsSocket')
  findOne(@MessageBody() id: number) {
    return this.resultsSocketService.findOne(id);
  }
}
