import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Response } from 'express';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('/generate')
  generateResult() {
    let draw_results = this.uniqueRNG(28, 6)
    // check if all results are double digit hence the powerball should be not greater than 9
    const checker = draw_results.every((element) => {
      return element >= 10 
    })

    if(checker) {
      draw_results.pop()
      draw_results.push({'powerball' :this.uniqueRNG(9, 1)[0]})
    }

    // Assign powerball to the first element that is <= 10.
    for (let index = 0; index < draw_results.length; index++) {
      if(draw_results[index] <= 9) {
        let cont = draw_results[index]
        draw_results[index] = {'powerball_def': cont}
        break;
      }
    }

    return draw_results;
  }

  private uniqueRNG(max_number_limit, iteration) {
    const results = [];
    let unique_results = []
    // Draw results ..
    for (let index = 1; index <= 15; index++) {
      results.push(Math.floor(Math.random() * max_number_limit) + 1)
      // Unique
      unique_results = [... new Set(results)]
    }

    return unique_results.slice(0, iteration);
  }

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultsService.remove(+id);
  }
}
