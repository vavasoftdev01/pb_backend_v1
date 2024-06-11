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


    return [
      {
        'streak': {
          'streak_count': streakCounter,
          'non_streak_count': nonStreakCounter,
          'even_streak_count': evenStreakContainer,
          'odd_streak_count': oddStreakContainer
        },
        'even_count': evenOddOverUnderCounter,
        'total_results': data.length,
        'results': collect(modified_results)
      }
    ];
  }

  @SubscribeMessage('findOneStatistic')
  findOne(@MessageBody() id: number) {
    return this.statisticsService.findOne(id);
  }
}
