import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ResultsSocketService } from './results-socket.service';
import {Socket, Server} from 'socket.io';
import collect from 'collect.js';
import * as moment from 'moment-timezone';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  
})
export class ResultsSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly resultsSocketService: ResultsSocketService) {}

  @SubscribeMessage('getPaginatedResults')
  async getAllResults(@MessageBody() params: {}) {

    const yesterday = moment().tz(process.env.APP_TIMEZONE).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
    const today =  moment().tz(process.env.APP_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');

    const total = await this.resultsSocketService.getResultsByDate(yesterday, today);
    const results = await this.resultsSocketService.getPaginatedResults(yesterday, today, params);

    collect(results).map((item) => {
      // PB Over / Under
      item['is_pb_under'] = (+item['pb'] < 4.5) ? 'under': 'over';

      // PB section
      if(+item['pb'] >= 0 && +item['pb'] <= 2) {
        item['pb_section'] = 'A';
      }

      if(+item['pb'] >= 3 && +item['pb'] <= 4) {
        item['pb_section'] = 'B';
      }

      if(+item['pb'] >= 5 && +item['pb'] <= 6) {
        item['pb_section'] = 'C';
      }

      if(+item['pb'] >= 7) {
        item['pb_section'] = 'D';
      }

      
      // num_sum_under Over / Under
      item['is_num_sum_under'] = (item['num_sum'] < 72.5) ? 'under': 'over';

      // Normal Ball Section +12 incrementation
      if(item['num_sum'] > 0 && item['num_sum'] <= 31) {
        item['normal_ball_section'] = 'A';
      }

      if(item['num_sum'] >= 32 && item['num_sum'] <= 43) {
        item['normal_ball_section'] = 'B'
      }

      if(item['num_sum'] >= 44 && item['num_sum'] <= 55) {
        item['normal_ball_section'] = 'C'
      }

      if(item['num_sum'] >= 56 && item['num_sum'] <= 67) {
        item['normal_ball_section'] = 'D'
      }

      if(item['num_sum'] >= 68) {
        item['normal_ball_section'] = 'F'
      }
    });

    return {
      'limit': params['limit'],
      'offset': params['offset'],
      'total_results': (total.length) ? Math.ceil(total.length / params['limit']) : 0,
      'results': (results) ? results: []
    }
    
  }

  @SubscribeMessage('findOneResultsSocket')
  findOne(@MessageBody() id: number) {
    return this.resultsSocketService.findOne(id);
  }
}
