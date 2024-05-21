import { Injectable } from '@nestjs/common';
import { CreateDrawResultDto } from './dto/create-draw-result.dto';
import { UpdateDrawResultDto } from './dto/update-draw-result.dto';
import { DrawResult } from './entities/draw-result.entity';
import { DataSource  } from 'typeorm';

@Injectable()
export class DrawResultsService {
  private resultRepository;
  constructor(private dataSource: DataSource) {
    this.resultRepository = this.dataSource.getRepository(DrawResult)
  }

  /**
   * 
   * @param data 
   * @returns idx
   */
  async create(data) {
    const result = this.resultRepository.create(data);
    const forUpdate =  await this.resultRepository.save(result);
    return forUpdate.idx;
  }

  async getLastSequenceId() {
    const data = await this.resultRepository.find({
      select: { id: true },
      order: { idx: "DESC" },
      take: 1
    });

    return data;
  }
  /**
   * 
   * @param range1Count 
   * @param range1Max 
   * @param range2Count 
   * @param range2Max 
   * @returns 
   */
  generateResults(range1Count, range1Max, range2Count, range2Max) {
    // Create an array of numbers for the first range (0 to range1Max)
    const range1Numbers = Array.from({ length: range1Max + 1 }, (_, index) => index);
    const randomNumbers = [];
  
    // Generate unique numbers from the first range
    for (let i = 0; i < range1Count; i++) {
      const randomIndex = Math.floor(Math.random() * range1Numbers.length);
      randomNumbers.push(range1Numbers[randomIndex]);
      range1Numbers.splice(randomIndex, 1); // Remove the number to ensure uniqueness
    }
  
    // Create an array of numbers for the second range (0 to range2Max) that excludes already picked numbers
    const range2Numbers = Array.from({ length: range2Max + 1 }, (_, index) => index).filter(num => !randomNumbers.includes(num));
    const additionalNumbers = [];
  
    // Generate unique numbers from the second range
    for (let i = 0; i < range2Count; i++) {
      const randomIndex = Math.floor(Math.random() * range2Numbers.length);
      additionalNumbers.push(range2Numbers[randomIndex]);
      range2Numbers.splice(randomIndex, 1); // Remove the number to ensure uniqueness
    }
  
    const cont = [...randomNumbers, ...additionalNumbers];

    return cont;
  }

  findAll() {
    return `Retireve all drawResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} drawResult`;
  }

  /**
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  async update(idx, data) {
    const updated = await this.dataSource
      .createQueryBuilder()
      .update(DrawResult)
      .set(data)
      .where("idx = :idx", { idx: idx })
      .execute();

    return updated;

  }

  remove(id: number) {
    return `This action removes a #${id} drawResult`;
  }
}
