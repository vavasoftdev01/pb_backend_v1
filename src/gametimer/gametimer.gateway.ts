import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { GametimerService } from './gametimer.service';
import {Socket, Server} from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'timer'
})
export class GametimerGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  
  private readonly betting_open_time_limit = parseInt(process.env.GAME_TIMER_LIMIT);
  private readonly betting_closed_time_limit = parseInt(process.env.GAME_TIMER_BETTING_CLOSED);
  private readonly draw_result_time_limit = parseInt(process.env.GAME_TIMER_DRAW_RESULT);

  timer_status: string = 'betting_open'; //Timer State
  dynamic_timer: number;

  constructor(private readonly gametimerService: GametimerService, private eventEmitter: EventEmitter2) {}

  afterInit(server: any) {
    this.start(this.betting_open_time_limit);
  }

  start(time_limit) {
    let timer = time_limit;
    let running_timer = setInterval(() => {
        timer -=1;
        this.dynamic_timer = timer;
        let formatted_time = new Date(timer * 1000).toISOString().substring(14, 19)
        this.server.emit('timerStart', formatted_time);
        this.checkTimer(running_timer);
    }, 1000);

  }

  /**
   * 
   * @param timer_id (for clearing timer/reset)
   */
  checkTimer(timer_id) {
    if(this.dynamic_timer <= 0) {
      console.log(`stop it :${this.timer_status}`);
      switch (this.timer_status) {
        case 'betting_closed':
          this.timer_status = 'draw_result';
          clearInterval(timer_id);

          this.eventEmitter.emit('insert.inital-results');

          this.start(this.draw_result_time_limit)
        break;

        case 'draw_result':
          this.timer_status = 'betting_open';
          clearInterval(timer_id);

          this.eventEmitter.emit('update.insert-results');

          this.start(this.betting_open_time_limit)
        break;
      
        default:
          this.timer_status = 'betting_closed';
          clearInterval(timer_id);
          this.start(this.betting_closed_time_limit)
        break;
      }
    }
  }

  handleConnection(client: any) {
    console.log(`Client connected ${client.id}`)
  }
  /**
   * TODO: Clean up 
   * @param client 
   */
  handleDisconnect(client: any) {
    console.log(`Client connected ${client.id}`)
  } 
}
