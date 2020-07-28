import { Controller, Get, Inject, Param, Post, Body } from '@nestjs/common';
import { Logger } from '../../domain/logger/logger.service';
import { Routes } from '../../common/routes/routes';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AccountResponse } from 'src/common/dtos/response/account.dto';
import { AlgodService } from 'src/core/services/algod.service';
import { CreateTransactionRequest } from 'src/common/dtos/request/createTransaction.dto';
import { CreateTransactionResponse } from 'src/common/dtos/response/tx.dto';

@ApiTags(Routes.algod)
@Controller(Routes.algod)
export class AlgodController {
  @Inject()
  private logger: Logger;
  constructor(private algodService: AlgodService) {}

  @Get(Routes.account + '/:accountId')
  @ApiOkResponse({
    type: AccountResponse
  })
  async getAccount(@Param('accountId') accountId: string): Promise<AccountResponse> {
    return this.algodService.getAccount(accountId);
  }

  @Post(Routes.transaction)
  @ApiOkResponse({
    type: AccountResponse
  })
  async createTransaction(@Body() body: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    return await this.algodService.createTransaction(body);
  }
}
