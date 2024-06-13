import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { StatisticsService } from './statistics.service';
import {Socket, Server} from 'socket.io';
import collect from 'collect.js';

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

  @SubscribeMessage('findDailyStatistics')
  async findAll() {
    const data = await this.statisticsService.findAll();

    let results = [];
    let previousValue = null;
    let container = [];
    
    
    for (let key in data) {
        if (data[key]['pb_odd'] === previousValue) {
            container.push(data[key]);
        } else {
            if (container.length > 0) {
                results.push(container);
                container = [];
            }
            container.push(data[key]);
        }
        previousValue = data[key]['pb_odd'];
    }
    
    if (container.length > 0) {
        results.push(container);
    }

    return results;
  }
  // TODO: for refactor..
  @SubscribeMessage('getDailyPBStatistics')
  async getDailyPBStatitistics() {
    const data = await this.statisticsService.findAll();

    let results = [];
    let previousValue = null;
    let container = [];
    let evenOddOverUnderCounter = 0;
    let streakCounter = 0;
    let nonStreakCounter = 0;

    collect(data).map((item) => {
      // PB Over / Under
      item['is_pb_under'] = (item['pb'] < 4.5) ? true: false;

      // PB section
      switch (item['pb']) {
        case 0 >= 2:
          item['pb_section'] = 'A';
          break;

        case 3 >= 4:
          item['pb_section'] = 'B';
          break;

        case 5 >= 6:
          item['pb_section'] = 'C';
          break;
      
        default:
          item['pb_section'] = 'D';
          break;
      }
      // num_sum_under Over / Under
      item['is_num_sum_under'] = (item['num_sum'] < 72.5) ? true: false; 
    });


    for (let key in data) 
    {
        // Streak
        if (data[key]['pb_odd'] === previousValue) 
        {
            container.push(data[key]);
            evenOddOverUnderCounter = (data[key]['pb_odd'] === 'E') ? evenOddOverUnderCounter + 1 : evenOddOverUnderCounter;   
        } 
        else 
        {
          // Non-streak
            if (container.length > 0) {
                results.push(container);
                container = [];
                
            }

            container.push(data[key]);
        }

      previousValue = data[key]['pb_odd'];
    }
    
    if (container.length > 0) {
      results.push(container);
    }

    let evenStreakCount = 0;
    let evenStreakContainer = [];
    let oddStreakCount = 0;
    let oddStreakContainer = [];

    collect(results).map((result) => {

      if(result.length > 1) {
        streakCounter = streakCounter + 1;

        if(result.length > evenStreakCount && result[0]['pb_odd'] == 'E') {
          evenStreakCount = 0;
          evenStreakContainer = [];
          evenStreakContainer.push(result);
          evenStreakCount = result.length;
        }

        if(result.length > oddStreakCount && result[0]['pb_odd'] == 'O') {
          oddStreakContainer = [];
          oddStreakContainer.push(result);
          oddStreakCount = result.length;
        }
      } 
      
      if(result.length == 1) {
        nonStreakCounter = nonStreakCounter + 1
      }
      
    });

    let modified_results = collect(results).map((item) => {
      let pb_odd = (item[0]['pb_odd'] == 'E') ? 'EVEN': 'ODD';
      return { [pb_odd] : item }
    });

    let normalBallLargeCount = 0;
    let normalBallLargeStreakContainer = [];
    let normalBallMediumCount = 0;
    let normalBallMediumStreakContainer = [];
    let normalBallSmallCount = 0;
    let normalBallSmallStreakContainer = [];
    let normalBallPreviousValue = null;

    // Normal ball streak
    for (let key in data) 
      {
          // Streak
          if (data[key]['num_sum_sec'] === normalBallPreviousValue) 
          {
            switch (data[key]['num_sum_sec']) {
              case 'S':
                normalBallSmallCount++; 
                normalBallSmallStreakContainer.push(data[key]);
                break;

              case 'M':
                normalBallMediumCount++;
                normalBallMediumStreakContainer.push(data[key]);
                break;
            
              default:
                normalBallLargeCount++;
                normalBallLargeStreakContainer.push(data[key]);
                break;
            }
            //evenOddOverUnderCounter = (data[key]['pb_odd'] === 'E') ? evenOddOverUnderCounter + 1 : evenOddOverUnderCounter;   
          } 


          normalBallPreviousValue = data[key]['num_sum_sec'];
      }

    

    return [
      {
        'streak': {
          'streak_count': streakCounter,
          'non_streak_count': nonStreakCounter,
          'even_streak_count': evenStreakContainer,
          'odd_streak_count': oddStreakContainer,
          'normal_ball_large_streak_count': normalBallLargeStreakContainer,
          'normal_ball_medium_streak_count': normalBallMediumStreakContainer,
          'normal_ball_small_streak_count': normalBallSmallStreakContainer,
        },
        'normal_ball_results': {
          'normal_ball_large_count': normalBallLargeCount,
          'normal_ball_medium_count': normalBallMediumCount,
          'normal_ball_small_count': normalBallSmallCount,
        },
        'even_count': evenOddOverUnderCounter,
        'results': collect(modified_results)
      }
    ];
  }

  @SubscribeMessage('findOneStatistic')
  findOne(@MessageBody() id: number) {
    return this.statisticsService.findOne(id);
  }
}
