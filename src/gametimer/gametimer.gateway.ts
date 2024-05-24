import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { GametimerService } from './gametimer.service';
import {Socket, Server} from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment-timezone';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'timer'
})
export class GametimerGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  
  private readonly betting_open_time_limit = parseInt(process.env.GAME_TIMER_BETTING_OPEN);
  private readonly betting_closed_time_limit = parseInt(process.env.GAME_TIMER_BETTING_CLOSED);
  private readonly draw_result_time_limit = parseInt(process.env.GAME_TIMER_DRAW_RESULT);

  timer_status: string = 'betting_open';
  dynamic_timer: number;
  advance_draw: boolean = true;
  insert_initial: boolean = true;
  advance_draw_execution_time_increments: number = 10;
  advance_draw_execution_time: number = 10; // seconds ahead
  advance_draw_execution_time_limit: number = 50; // seconds before the reset to advance_draw_execution_time.

  constructor(private readonly gametimerService: GametimerService, private eventEmitter: EventEmitter2) {}

  afterInit(server: any) {
    this.start(this.betting_open_time_limit);
  }

  start(time_limit) {
    let timer = time_limit;
    let running_timer = setInterval(() => {
        timer -= 1;
        this.dynamic_timer = timer;
        let formatted_time = new Date(timer * 1000).toISOString().substring(14, 19)
        this.server.emit('timerStart', {'formatted_time':formatted_time, 'timer': timer, 'time_limit': time_limit, 'timer_status': this.timer_status });

        if(this.dynamic_timer < this.advance_draw_execution_time) {
          this.advanceDraw();
        }
        
        this.checkTimer(running_timer);
    }, 1000);

  }

  /**
   * This method prevents drawing result later than a minute vs the edate.
   * It SHOULD always draw earlier or within the edate.
   * advance_draw = ensures that the query will run once per scenario.
   */
  private advanceDraw() {
    // Advance draw
    if(this.timer_status == 'betting_open' && this.advance_draw) {
      this.eventEmitter.emit('update.draw-results');
      this.advance_draw = false;
      this.advance_draw_execution_time = (this.advance_draw_execution_time >= this.advance_draw_execution_time_limit) ? 
        this.advance_draw_execution_time 
        : this.advance_draw_execution_time + this.advance_draw_execution_time_increments;
    }
  }

  /**
   * 
   * @param timer_id (for clearing timer/reset)
   */
  checkTimer(timer_id) {
    if(this.dynamic_timer <= 0) {
      switch (this.timer_status) {
        case 'betting_closed':
          this.timer_status = 'draw_result';
          clearInterval(timer_id);
          
          this.start(this.draw_result_time_limit)
        break;

        case 'draw_result':
          this.timer_status = 'betting_open';
          clearInterval(timer_id);
          this.eventEmitter.emit('insert.inital-results');
          
          this.start(this.betting_open_time_limit)
        break;
      
        default:
          this.timer_status = 'betting_closed';
          this.advance_draw = true;
          clearInterval(timer_id);
          this.start(this.betting_closed_time_limit)
        break;
      }
    } else {
      // This method will only run once, every time the web server restarts.. since the emmitter has issue on afterinit..
        if(this.timer_status == 'betting_open' && this.insert_initial) {
          this.eventEmitter.emit('insert.inital-results');
          this.insert_initial = false;
        }
    }

    console.log(`timer status :${this.timer_status}`);

    this.server.emit('timerStatus', this.timer_status);
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
