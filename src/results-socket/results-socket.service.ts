import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Between } from 'typeorm';
import { ResultsSocket } from './entities/results-socket.entity';

@Injectable()
export class ResultsSocketService {
  private resultRepository;
  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(ResultsSocket)
  }

  async getResultsByDate(startDate, endDate) {
    const data = await this.resultRepository.find({
      where: {
        modifydate: Between(startDate ,endDate),
        pb: Not(IsNull())
      },
      select: ['idx']
    });
    
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultsSocket`;
  }

  async getPaginatedResults(startDate, endDate, params) {
    const data = await this.resultRepository.find({
      where: {
        modifydate: Between(startDate ,endDate),
        pb: Not(IsNull())
      },
      skip: params.offset,
      take: params.limit,
    });
      
    return data;
  }

}
