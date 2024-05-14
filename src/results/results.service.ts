import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { DataSource } from 'typeorm';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultsService {
  private resultRepository;

  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(Result)
  }


  create(createResultDto: CreateResultDto) {
    return 'This action adds a new result';
  }

   findAll() {
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
