import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { DataSource } from 'typeorm';
import { Result } from './entities/result.entity';
import * as moment from "moment";


@Injectable()
export class ResultsService {
  private resultRepository;

  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(Result)
  }

  async saveResults(data) {
    
   return data;
    // Save DB
    // const date_now = moment(new Date());
    // const result = new Result()

    // result.game = '3M_powerball';
    // result.id = 1004;
    // result.round = 1311;
    // result.dt = date_now.format('YYYY-MM-DD');
    // result.sdate = String(date_now.format('HH:MM:s')) // Timer start..
    // result.edate = String(date_now.add(3, 'minutes').format('HH:MM:s')) // Timer end ..
    // result.pb = String(data[0]['powerball']);
    // result.num1 = data[1]['normal_ball'];
    // result.num2 = data[2]['normal_ball'];
    // result.num3 = data[3]['normal_ball'];
    // result.num4 = data[4]['normal_ball'];
    // result.num5 = data[5]['normal_ball'];
    // result.num_sum =  data[data.length - 1]['num_sum'];
    // result.num_sum_odd = data[data.length - 1]['num_sum_odd'];
    // result.pb_odd = data[data.length - 1]['pb_odd'];
    // result.regdate = new Date(date_now.format('YYYY-MM-DD HH:mm:ss'));
    // result.modifydate = new Date(date_now.format('YYYY-MM-DD HH:mm:ss'));
    // result.accountdate = new Date(date_now.format('YYYY-MM-DD HH:mm:ss'));
    // result.void = null
  }


  create(createResultDto: CreateResultDto) {
    return 'This action adds a new result';
  }

   async findAll() {
    return this.resultRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} result`;
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
