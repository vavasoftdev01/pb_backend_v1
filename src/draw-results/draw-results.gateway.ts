import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { DrawResultsService } from './draw-results.service';
import { CreateDrawResultDto } from './dto/create-draw-result.dto';
import { UpdateDrawResultDto } from './dto/update-draw-result.dto';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import * as moment from "moment-timezone";



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
    })

    // Round - (round)
    const date_now = moment(new Date()).tz(process.env.APP_TIMEZONE);
    const minutesInDay = date_now.hours() * 60 + date_now.minutes() / parseInt(process.env.GAME_TIMER_SETTING);
    const round_number = Math.trunc((1440 - Math.round(minutesInDay)) / parseInt(process.env.GAME_TIMER_SETTING));

    // End date - (edate) add 3 minutes for pb_timer settings..
    const date = new Date();
    const end_date = moment(new Date(date.getTime() + parseInt(process.env.GAME_TIMER_SETTING) * 60000)).tz(process.env.APP_TIMEZONE);

    console.log(moment(end_date).tz(process.env.APP_TIMEZONE).format('HH:mm:00'));
    console.log(`reg ${date_now.format('YYYY-MM-DD HH:mm:00')}`)

    const data = {
      'game': process.env.APP_NAME,
      'id': cont['id'] + 1,
      'round': round_number - 1,
      'dt': date_now.format('YYYY-MM-DD'),
      'sdate': String(date_now.format('HH:mm:00')),
      'edate': String(end_date.format('HH:mm:00')),
      'regdate': date_now.format('YYYY-MM-DD HH:mm:00'),
      //'modify_date': `${date_now.format('YYYY-MM-DD')} ${date_now.format('HH:mm:00')}`
    };

    this.last_inserted_id = await this.drawResultsService.create(data);
  }


  @OnEvent('update.insert-results', { async: true})
  update(@MessageBody() updateDrawResultDto: UpdateDrawResultDto) {
    console.log('update - insert results');

    //return this.drawResultsService.update(updateDrawResultDto.id, updateDrawResultDto);
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
