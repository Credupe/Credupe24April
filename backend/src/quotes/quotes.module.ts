import { Module } from '@nestjs/common';
import { LoanProductsModule } from '../loan-products/loan-products.module';
import { LoanApplicationsModule } from '../loan-applications/loan-applications.module';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';

@Module({
  imports: [LoanProductsModule, LoanApplicationsModule],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
