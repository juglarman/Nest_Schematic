import { IsNotEmpty } from 'class-validator';

export class CreateTransactionRequest {
  @IsNotEmpty()
  amount: number;
}
