import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { StatisticsService } from './statistics.service';
import {Socket, Server} from 'socket.io';
import collect from 'collect.js';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class StatisticsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly statisticsService: StatisticsService) {}

  @SubscribeMessage('findDailyStatistics')
  async findAll() {
    const data = await this.statisticsService.findAll({});

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
  @SubscribeMessage('getStatistics')
  async getDailyPBStatitistics(@MessageBody() params: {}) {
    const filters = collect(params);
    let type = filters.get('type');
    const dateFilters = filters.forget('type');
    const data = await this.statisticsService.findAll(dateFilters);
    

    let results = [];
    let previousValue = null;
    let container = [];
    let evenOddOverUnderCounter = 0;
    let streakCounter = 0;
    let nonStreakCounter = 0;
    let underOddCount = 0;
    let underEvenCount = 0;
    let overOddCount = 0;
    let overEvenCount = 0;
    let underNumSumEven = 0;
    let underNumSumOdd = 0;
    let overNumSumEven = 0;
    let overNumSumOdd = 0;

    collect(data).map((item) => {
      // PB Over / Under
      item['is_pb_under'] = (item['pb'] <= 4.5) ? 'Y': 'N';
      (item['pb'] <= 4.5 && item['pb_odd'] == 'O') ? underOddCount++: underOddCount;
      (item['pb'] <= 4.5 && item['pb_odd'] == 'E') ? underEvenCount++: underEvenCount;
      (item['pb'] >= 4.5 && item['pb_odd'] == 'O') ? overOddCount++: overOddCount;
      (item['pb'] >= 4.5 && item['pb_odd'] == 'E') ? overEvenCount++: overEvenCount;
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
      item['is_num_sum_under'] = (item['num_sum'] < 72.5) ? 'Y': 'N'; 
      (item['num_sum'] <= 72.5 && item['num_sum_odd'] == 'O') ? underNumSumOdd++: underNumSumOdd;
      (item['num_sum'] <= 72.5 && item['num_sum_odd'] == 'E') ? underNumSumEven++: underNumSumEven;
      (item['num_sum'] >= 72.5 && item['num_sum_odd'] == 'O') ? overNumSumOdd++: overNumSumOdd;
      (item['num_sum'] >= 72.5 && item['num_sum_odd'] == 'E') ? overNumSumEven++: overNumSumEven;
    });


    for (let key in data) 
    {
      evenOddOverUnderCounter = (data[key]['pb_odd'] === 'E') ? evenOddOverUnderCounter + 1 : evenOddOverUnderCounter;

      let value = data[key][`${type}`];

      // Streak
      if (value === previousValue) 
      {
          container.push(data[key]);   
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

      previousValue = value;
    }
    
    if (container.length > 0) {
      results.push(container);
    }

    let evenStreakCount = 0;
    let evenStreakContainer = [];
    let oddStreakCount = 0;
    let oddStreakContainer = [];
    let pbUnderStreakCount = 0;
    let pbUnderStreakContainer = [];
    let pbOverStreakCount = 0;
    let pbOverStreakContainer = [];
    let normalBallUnderStreakCount = 0;
    let normalBallUnderStreakContainer = [];
    let normalBallOverStreakCount = 0;
    let normalBallOverStreakContainer = [];

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

        if(result.length > 1 && result[0]['is_pb_under'] == 'Y') {
          pbUnderStreakCount = 0;
          pbUnderStreakContainer = [];
          pbUnderStreakContainer.push(result);
          pbUnderStreakCount = result.length;
        }

        if(result.length > 1 && result[0]['is_pb_under'] == 'N') {
          pbOverStreakCount = 0;
          pbOverStreakContainer = [];
          pbOverStreakContainer.push(result);
          pbOverStreakCount = result.length;
        }

      } 
      
      if(result.length == 1) {
        nonStreakCounter = nonStreakCounter + 1
      }
      
    });

    let modified_results = collect(results).map((item) => {
      let container;
      let key = item[0][`${type}`];

      if(type == 'pb_odd') {
        container = (key == 'E') ? 'EVEN': 'ODD';
      }

      if(type == 'num_sum_odd') {
        container = (key == 'E') ? 'NM_EVEN': 'NM_ODD';
      }

      if(type == 'is_pb_under') {
        container = (key == 'N') ? 'OVER': 'UNDER';
      }

      if(type == 'is_num_sum_under') {
        container = (key == 'N') ? 'OVER': 'UNDER';
      }

      return { [container] : item }
    });

    let normalBallLargeCount = 0;
    let normalBallLargeStreakContainer = [];
    let normalBallMediumCount = 0;
    let normalBallMediumStreakContainer = [];
    let normalBallSmallCount = 0;
    let normalBallSmallStreakContainer = [];
    let normalBallPreviousValue = null;
    let normalBallUnderCount = 0;
    let normalBallOverCount = 0;
    let normalBallOddCount = 0;
    let normalBallEvenCount = 0;
    let pBUnderCount = 0;
    let pBOverCount = 0;

    // Normal ball streak
    for (let key in data) 
      {
          // Streak
          if (data[key]['num_sum_sec'] === normalBallPreviousValue) 
          {
            switch (data[key]['num_sum_sec']) {
              case 'S':
                normalBallSmallStreakContainer.push(data[key]);
                break;

              case 'M':
                normalBallMediumStreakContainer.push(data[key]);
                break;
            
              default:
                normalBallLargeStreakContainer.push(data[key]);
                break;
            }
          }

          (data[key]['num_sum_sec'] == 'S') ? normalBallSmallCount++ : normalBallSmallCount;
          (data[key]['num_sum_sec'] == 'M') ? normalBallMediumCount++ : normalBallMediumCount;
          (data[key]['num_sum_sec'] == 'L') ? normalBallLargeCount++ : normalBallLargeCount;

          (data[key]['num_sum'] < 72.5) ? normalBallUnderCount++ : normalBallOverCount++;
          (data[key]['num_sum_odd'] == 'E') ? normalBallEvenCount++ : normalBallOddCount++;
          (data[key]['pb'] < 4.5) ? pBUnderCount++ : pBOverCount++;
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
          'pb_under_streak_count': pbUnderStreakContainer,
          'pb_over_streak_count': pbOverStreakContainer,
          'normal_ball_under_streak_count': normalBallUnderStreakCount,
          'normal_ball_over_streak_count': normalBallOverStreakCount,

        },
        'normal_ball_results': {
          'normal_ball_large_count': normalBallLargeCount,
          'normal_ball_medium_count': normalBallMediumCount,
          'normal_ball_small_count': normalBallSmallCount,
          'normal_ball_over_count': normalBallOverCount,
          'normal_ball_under_count': normalBallUnderCount,
          'normal_ball_even_count': normalBallEvenCount,
          'normal_ball_odd_count': normalBallOddCount,
          'over_even_normal_ball_count': overNumSumEven,
          'over_odd_normal_ball_count': overNumSumOdd,
          'under_even_normal_ball_count': underNumSumEven,
          'under_odd_normal_ball_count': underNumSumOdd,
        },
        'even_count': evenOddOverUnderCounter,
        'under_count': pBUnderCount,
        'over_count': pBOverCount,
        'under_odd_count': underOddCount,
        'under_even_count': underEvenCount,
        'over_odd_count': overOddCount,
        'over_even_count': overEvenCount,
        'results_count': collect(data).count(),
        'results': collect(modified_results)
      }
    ];
  }

  @SubscribeMessage('findOneStatistic')
  findOne(@MessageBody() id: number) {
    return this.statisticsService.findOne(id);
  }
}
