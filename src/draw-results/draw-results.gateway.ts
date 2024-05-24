import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { DrawResultsService } from './draw-results.service';
import { CreateDrawResultDto } from './dto/create-draw-result.dto';
import { UpdateDrawResultDto } from './dto/update-draw-result.dto';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import * as moment from 'moment-timezone';


@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'results'
})
export class DrawResultsGateway {
  @WebSocketServer()
  server: Server;

  last_inserted_id: number;

  constructor(private readonly drawResultsService: DrawResultsService) {}

  /**
   *  Compose parameters..
   * @param createDrawResultDto 
   * @returns  id
   */
  @OnEvent('insert.inital-results', { async: true })
  async create() {
    let cont = {};
    const sequence_fields = await this.drawResultsService.getLastSequenceId();
    sequence_fields.map((result) => {
      cont = { 'id': result.id }
    });

    const date_now = moment(new Date()).tz(process.env.APP_TIMEZONE);

    // Round - (round)
    const round_number = this.getRound();
    // End date - (edate) add 3 minutes for pb_timer settings..
    const date = new Date();
    const end_date = moment(new Date(date.getTime() + parseInt(process.env.GAME_TIMER_SETTING) * 60000)).tz(process.env.APP_TIMEZONE);

    const data = {
      'game': process.env.APP_NAME,
      'id': (Object.keys(cont).length > 0) ? cont['id'] + 1 : 1,
      'round': round_number,
      'dt': date_now.format('YYYY-MM-DD'),
      'sdate': String(date_now.format('HH:mm:00')),
      'edate': String(end_date.format('HH:mm:00')),
      'regdate': date_now.format('YYYY-MM-DD HH:mm:00'),
    };

    this.last_inserted_id = await this.drawResultsService.create(data);
  }

  private getRound() {
    const date_now = moment.tz('Asia/Seoul');
    const zero = date_now.clone().startOf('day');
    const time = date_now.diff(zero, 'second') - 0;
    return Math.floor(time / parseInt(process.env.GAME_TIMER_LIMIT)) + 1;
  }

  @OnEvent('update.draw-results', { async: true })
  async update(@MessageBody() updateDrawResultDto: UpdateDrawResultDto) {
    const result = await this.drawResultsService.generateResults(5, 29, 1, 9);
    const num_sum = result[0] + result[1] + result[2] + result[3] + result[4];
    // num_sum_sec
    let num_sum_sec = 'L';
    if(num_sum >= 15 && num_sum <= 64) {
      num_sum_sec = 'S';
    }
    else if(num_sum >= 65 && num_sum <= 80) {
      num_sum_sec = 'M';
    }

    const num_sum_odd = (num_sum % 2 == 0) ? 'E': 'O';
    const pb_odd = (result[5] % 2 == 0) ? 'E': 'O';

    // Date constraints..
    const date_now = new Date;
    const modify_date = moment().tz(process.env.APP_TIMEZONE);
    const account_date = moment(new Date(date_now.getTime() + 0 * 60000)).tz(process.env.APP_TIMEZONE); // TODO..
    const data = {
      'num1': result[0].toString(),
      'num2': result[1].toString(),
      'num3': result[2].toString(),
      'num4': result[3].toString(),
      'num5': result[4].toString(),
      'pb': result[5].toString(),
      'num_sum': num_sum.toString(),
      'num_sum_sec': num_sum_sec.toString(),
      'num_sum_odd': num_sum_odd.toString(),
      'pb_odd': pb_odd.toString(),
      'modifydate': modify_date.format('YYYY-MM-DD HH:mm:ss:00'), // after animation ends in FE result must be released in advance
      //'accountdate': account_date.format('YYYY-MM-DD HH:mm:00') // TODO: This column is used to enter the settlement date after betting
    };
    
    const updated = await this.drawResultsService.update(this.last_inserted_id, data);

    this.getResults();

    return updated;
  }

  /**
   * Emitter for FE
   */
  @SubscribeMessage('findAllDrawResults')
  async getResults() {
    const results = await this.drawResultsService.findOneBy({'idx': this.last_inserted_id});
    this.server.emit('send', results);
  }

  @SubscribeMessage('findAllDrawResults')
  findAll() {
    return this.drawResultsService.findAll();
  }

  @SubscribeMessage('findOneDrawResult')
  findOne(@MessageBody() id: number) {
    return this.drawResultsService.findOne(id);
  }


  @SubscribeMessage('removeDrawResult')
  remove(@MessageBody() id: number) {
    return this.drawResultsService.remove(id);
  }
}
