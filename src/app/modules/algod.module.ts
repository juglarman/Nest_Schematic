import { Module, HttpModule } from '@nestjs/common';
import { AlgodController } from '../controllers/algod.controller';
import { AlgodService } from 'src/core/services/algod.service';
import { AlgodClient } from 'src/client/algod.client';
@Module({
  imports: [HttpModule],
  controllers: [AlgodController],
  providers: [AlgodService, AlgodClient]
})
export class AlgodModule {}
