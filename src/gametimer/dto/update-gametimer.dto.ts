import { PartialType } from '@nestjs/mapped-types';
import { CreateGametimerDto } from './create-gametimer.dto';

export class UpdateGametimerDto extends PartialType(CreateGametimerDto) {
  id: number;
}
