import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not } from 'typeorm';
import { ResultsSocket } from './entities/results-socket.entity';
import { notEqual } from 'assert';

@Injectable()
export class ResultsSocketService {
  private resultRepository;
  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(ResultsSocket)
  }

  findAll() {
    return `This action returns all resultsSocket`;
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
      .offset(params.offset)
      .limit(params.limit)
      .getMany()
   
    return data;
  }

}
