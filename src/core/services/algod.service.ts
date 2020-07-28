import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Logger } from '../../domain/logger/logger.service';
import { AlgodClient } from 'src/client/algod.client';
import { AccountResponse } from 'src/common/dtos/response/account.dto';
import { ConfigService } from 'src/config/config.service';
import * as algosdk from 'algosdk';
import { Accounts } from 'src/domain/constants/accounts.constant';
import { TransactionParams } from 'src/domain/models/transactionParams.model';
import { CreateTransactionRequest } from 'src/common/dtos/request/createTransaction.dto';
import { TransactionParamsResponse } from 'src/client/dtos/response/transactionParams.dto';
import { CreateTransactionResponse } from 'src/common/dtos/response/tx.dto';

@Injectable()
export class AlgodService implements OnModuleInit {
  @Inject()
  private readonly logger: Logger;

  constructor(private algodClient: AlgodClient, private configService: ConfigService) {}

  onModuleInit() {
    this.logger.setContext(AlgodService.name);
  }

  async getAccount(accountId: string): Promise<AccountResponse> {
    const secret = this.configService.get(Accounts[accountId].mnemonic_env);
    const account = algosdk.mnemonicToSecretKey(secret);
    const addr = account.addr;
    const { address, amount, rewards, round, status } = (await this.algodClient.getAccount(addr))?.data;
    const accountResponse: AccountResponse = {
      address,
      amount,
      rewards,
      round,
      status
    };
    return accountResponse;
  }

  async createTransaction(createTransaction: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const secret1 = this.configService.get(Accounts['account1'].mnemonic_env);
    const secret2 = this.configService.get(Accounts['account2'].mnemonic_env);
    const account1 = algosdk.mnemonicToSecretKey(secret1);
    const account2 = algosdk.mnemonicToSecretKey(secret2);
    const addr1 = account1.addr;
    const addr2 = account2.addr;
    const params = await this.getTransactionParams();
    const paramsCamel: TransactionParams = {
      flatFee: true,
      fee: 1000,
      firstRound: params['last-round'],
      lastRound: params['last-round'] + 1000,
      genesisID: params['genesis-id'],
      genesisHash: params['genesis-hash']
    };
    const note = algosdk.encodeObj('SG test');

    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      addr1,
      addr2,
      createTransaction.amount,
      undefined,
      note,
      paramsCamel
    );
    const signedTxn = txn.signTxn(account1.sk);
    const tx = (await this.algodClient.createTransaction(signedTxn)).data;
    await this.waitForConfirmation(tx.txId);
    return tx;
  }

  async getTransactionParams(): Promise<TransactionParamsResponse> {
    return (await this.algodClient.getTransactionParams()).data;
  }

  async waitForConfirmation(txId: string): Promise<void> {
    const status = (await this.algodClient.getStatus()).data;
    let lastRound = status['last-round'];
    let tries = 0;
    while (tries < 5) {
      const pendingInfo = (await this.algodClient.getPendingTransaction(txId)).data;
      if (pendingInfo['confirmed-round'] && pendingInfo['confirmed-round'] > 0) {
        console.log('Transaction ' + txId + ' confirmed in round ' + pendingInfo['confirmed-round']);
        break;
      }
      lastRound++;
      tries++;
      await this.algodClient.getStatusAfterBlock(lastRound);
    }
  }
}
