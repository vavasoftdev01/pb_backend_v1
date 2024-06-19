import { PartialType } from '@nestjs/mapped-types';
import { CreateResultsSocketDto } from './create-results-socket.dto';

export class UpdateResultsSocketDto extends PartialType(CreateResultsSocketDto) {
  id: number;
}
