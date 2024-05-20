import { PartialType } from '@nestjs/mapped-types';
import { CreateDrawResultDto } from './create-draw-result.dto';

export class UpdateDrawResultDto extends PartialType(CreateDrawResultDto) {
  id: number;
}
