import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not } from 'typeorm';
import { ResultsSocket } from './entities/results-socket.entity';

@Injectable()
export class ResultsSocketService {
  private resultRepository;
  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(ResultsSocket)
  }

  async getAllResults() {
    const data = await this.dataSource
      .getRepository(ResultsSocket)
      .createQueryBuilder("results")
      .where('pb IS NOT NULL')
      .orderBy("idx", "DESC")
      .getCount();
   
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultsSocket`;
  }

  async getPaginatedResults(params) {
    const data = await this.dataSource
      .getRepository(ResultsSocket)
      .createQueryBuilder("results")
      .where('pb IS NOT NULL')
      .orderBy("idx", "DESC")
      .take(params.limit)
      .skip(params.offset)
      .getMany();
   
    return data;
  }

}
